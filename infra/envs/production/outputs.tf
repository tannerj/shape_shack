output "nameservers" {
  description = "Update your domain registrar to point j12es.com to these NS records"
  value       = aws_route53_zone.main.name_servers
}

output "app_url" {
  value = "https://${var.domain_name}"
}

output "alb_dns_name" {
  description = "ALB DNS name (useful for debugging before DNS propagates)"
  value       = module.alb.alb_dns_name
}

output "ecr_api_url" {
  value = module.ecr.api_repository_url
}

output "ecr_web_url" {
  value = module.ecr.web_repository_url
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "github_actions_access_key_id" {
  description = "Store as GitHub secret: AWS_ACCESS_KEY_ID"
  value       = aws_iam_access_key.github_actions.id
}

output "github_actions_secret_access_key" {
  description = "Store as GitHub secret: AWS_SECRET_ACCESS_KEY"
  value       = aws_iam_access_key.github_actions.secret
  sensitive   = true
}
