variable "app_name"    { type = string }
variable "environment" { type = string }

variable "vpc_id"            { type = string }
variable "public_subnet_ids" { type = list(string) }
variable "domain_name"       { type = string }
variable "route53_zone_id"   { type = string }
