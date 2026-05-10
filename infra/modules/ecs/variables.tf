variable "app_name"    { type = string }
variable "environment" { type = string }
variable "aws_region"  { type = string }

variable "vpc_id"                 { type = string }
variable "private_subnet_ids"     { type = list(string) }
variable "api_security_group_id"  { type = string }
variable "web_security_group_id"  { type = string }
variable "api_target_group_arn"   { type = string }
variable "web_target_group_arn"   { type = string }

variable "api_ecr_repository_url" { type = string }
variable "web_ecr_repository_url" { type = string }
variable "api_image_tag"          { type = string; default = "latest" }
variable "web_image_tag"          { type = string; default = "latest" }

variable "database_url_secret_arn" { type = string; sensitive = true }
variable "rails_master_key"        { type = string; sensitive = true }
variable "redis_url"               { type = string }
variable "s3_bucket_name"          { type = string }
variable "s3_bucket_arn"           { type = string }

variable "api_cpu"               { type = number; default = 512 }
variable "api_memory"            { type = number; default = 1024 }
variable "web_cpu"               { type = number; default = 256 }
variable "web_memory"            { type = number; default = 512 }
variable "api_desired_count"     { type = number; default = 1 }
variable "web_desired_count"     { type = number; default = 1 }
variable "sidekiq_desired_count" { type = number; default = 1 }
