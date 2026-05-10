locals {
  prefix = "${var.app_name}-${var.environment}"
}

# ── Route 53 Hosted Zone ──────────────────────────────────────────────────────
# After first `terraform apply`, update your domain registrar's NS records
# to the nameservers shown in the `nameservers` output.

resource "aws_route53_zone" "main" {
  name = "j12es.com"
}

# ── Networking ────────────────────────────────────────────────────────────────

module "networking" {
  source      = "../../modules/networking"
  app_name    = var.app_name
  environment = var.environment
}

# ── Security Groups ───────────────────────────────────────────────────────────
# Created here (not inside the ECS module) so RDS and ElastiCache can reference
# them without creating a circular module dependency.

module "alb" {
  source      = "../../modules/alb"
  app_name    = var.app_name
  environment = var.environment

  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids
  domain_name       = var.domain_name
  route53_zone_id   = aws_route53_zone.main.zone_id
}

resource "aws_security_group" "api" {
  name        = "${local.prefix}-api-sg"
  description = "ECS API tasks — accepts traffic from ALB on port 3000"
  vpc_id      = module.networking.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [module.alb.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "web" {
  name        = "${local.prefix}-web-sg"
  description = "ECS web tasks — accepts traffic from ALB on port 80"
  vpc_id      = module.networking.vpc_id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [module.alb.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ── ECR Repositories ──────────────────────────────────────────────────────────

module "ecr" {
  source      = "../../modules/ecr"
  app_name    = var.app_name
  environment = var.environment
}

# ── S3 Uploads Bucket ─────────────────────────────────────────────────────────

module "s3" {
  source      = "../../modules/s3"
  app_name    = var.app_name
  environment = var.environment
  domain_name = var.domain_name
}

# ── RDS PostgreSQL ────────────────────────────────────────────────────────────

module "rds" {
  source      = "../../modules/rds"
  app_name    = var.app_name
  environment = var.environment

  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  api_security_group_id = aws_security_group.api.id

  db_password         = var.db_password
  db_instance_class   = var.db_instance_class
  skip_final_snapshot = false
}

# ── ElastiCache Redis ─────────────────────────────────────────────────────────

module "elasticache" {
  source      = "../../modules/elasticache"
  app_name    = var.app_name
  environment = var.environment

  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  api_security_group_id = aws_security_group.api.id

  node_type = var.elasticache_node_type
}

# ── ECS Cluster + Services ────────────────────────────────────────────────────

module "ecs" {
  source      = "../../modules/ecs"
  app_name    = var.app_name
  environment = var.environment
  aws_region  = var.aws_region

  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  api_security_group_id = aws_security_group.api.id
  web_security_group_id = aws_security_group.web.id
  api_target_group_arn  = module.alb.api_target_group_arn
  web_target_group_arn  = module.alb.web_target_group_arn

  api_ecr_repository_url = module.ecr.api_repository_url
  web_ecr_repository_url = module.ecr.web_repository_url
  api_image_tag          = var.api_image_tag
  web_image_tag          = var.web_image_tag

  database_url_secret_arn = module.rds.database_url_secret_arn
  rails_master_key        = var.rails_master_key
  redis_url               = module.elasticache.redis_url
  s3_bucket_name          = module.s3.bucket_name
  s3_bucket_arn           = module.s3.bucket_arn

  api_cpu    = var.api_cpu
  api_memory = var.api_memory
  web_cpu    = var.web_cpu
  web_memory = var.web_memory
}

# ── GitHub Actions IAM User ───────────────────────────────────────────────────

resource "aws_iam_user" "github_actions" {
  name = "${local.prefix}-github-actions"
}

resource "aws_iam_access_key" "github_actions" {
  user = aws_iam_user.github_actions.name
}

resource "aws_iam_user_policy" "github_actions" {
  name = "deploy-access"
  user = aws_iam_user.github_actions.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECR"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
          "ecr:DescribeRepositories",
        ]
        Resource = "*"
      },
      {
        Sid    = "TerraformState"
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"]
        Resource = [
          "arn:aws:s3:::shape-shack-terraform-state",
          "arn:aws:s3:::shape-shack-terraform-state/*",
        ]
      },
      {
        Sid      = "TerraformLock"
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:*:table/shape-shack-terraform-locks"
      },
      {
        Sid    = "ECS"
        Effect = "Allow"
        Action = [
          "ecs:DescribeTaskDefinition",
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService",
          "ecs:DescribeServices",
          "ecs:DescribeClusters",
          "ecs:TagResource",
        ]
        Resource = "*"
      },
      {
        Sid    = "IAMPassRole"
        Effect = "Allow"
        Action = ["iam:PassRole"]
        Resource = [
          "arn:aws:iam::*:role/${local.prefix}-ecs-execution-role",
          "arn:aws:iam::*:role/${local.prefix}-ecs-task-role",
        ]
      },
      {
        Sid    = "ReadInfraState"
        Effect = "Allow"
        Action = [
          "ec2:Describe*",
          "ec2:GetSecurityGroupsForVpc",
          "elasticache:Describe*",
          "rds:Describe*",
          "secretsmanager:DescribeSecret",
          "secretsmanager:GetSecretValue",
          "logs:DescribeLogGroups",
          "logs:CreateLogGroup",
          "logs:PutRetentionPolicy",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:GetUser",
          "iam:GetUserPolicy",
          "iam:ListUserPolicies",
          "iam:ListAccessKeys",
          "route53:GetHostedZone",
          "route53:ListResourceRecordSets",
          "acm:DescribeCertificate",
          "acm:ListCertificates",
          "elasticloadbalancing:Describe*",
          "s3:GetBucketVersioning",
          "s3:GetBucketPolicy",
          "s3:GetEncryptionConfiguration",
          "s3:GetBucketCORS",
          "s3:GetBucketPublicAccessBlock",
          "s3:ListAllMyBuckets",
        ]
        Resource = "*"
      },
    ]
  })
}
