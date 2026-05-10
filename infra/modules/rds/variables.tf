variable "app_name"    { type = string }
variable "environment" { type = string }

variable "vpc_id"              { type = string }
variable "private_subnet_ids"  { type = list(string) }
variable "api_security_group_id" { type = string }

variable "db_name"     { type = string; default = "shape_shack_production" }
variable "db_username" { type = string; default = "shape_shack" }
variable "db_password" { type = string; sensitive = true }

variable "db_instance_class"    { type = string; default = "db.t3.micro" }
variable "db_allocated_storage" { type = number; default = 20 }
variable "skip_final_snapshot"  { type = bool; default = false }
