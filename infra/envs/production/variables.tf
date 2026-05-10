variable "aws_region"  { type = string; default = "us-east-1" }
variable "app_name"    { type = string; default = "shape-shack" }
variable "environment" { type = string; default = "production" }
variable "domain_name" { type = string; default = "shapeshack.j12es.com" }

variable "db_password"      { type = string; sensitive = true }
variable "rails_master_key" { type = string; sensitive = true }

variable "api_image_tag" { type = string; default = "latest" }
variable "web_image_tag" { type = string; default = "latest" }

variable "db_instance_class"     { type = string; default = "db.t3.micro" }
variable "elasticache_node_type" { type = string; default = "cache.t3.micro" }
variable "api_cpu"               { type = number; default = 512 }
variable "api_memory"            { type = number; default = 1024 }
variable "web_cpu"               { type = number; default = 256 }
variable "web_memory"            { type = number; default = 512 }
