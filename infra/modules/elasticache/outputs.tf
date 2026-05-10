output "redis_url" {
  value = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379/0"
}

output "redis_security_group_id" { value = aws_security_group.redis.id }
