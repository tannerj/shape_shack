output "api_repository_url" { value = aws_ecr_repository.api.repository_url }
output "web_repository_url" { value = aws_ecr_repository.web.repository_url }
output "registry_id"        { value = aws_ecr_repository.api.registry_id }
