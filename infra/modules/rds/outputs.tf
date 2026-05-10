output "database_url_secret_arn" { value = aws_secretsmanager_secret.database_url.arn }
output "rds_security_group_id"   { value = aws_security_group.rds.id }
output "db_endpoint"             { value = aws_db_instance.main.endpoint }
