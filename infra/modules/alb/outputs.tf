output "alb_security_group_id" { value = aws_security_group.alb.id }
output "api_target_group_arn"  { value = aws_lb_target_group.api.arn }
output "web_target_group_arn"  { value = aws_lb_target_group.web.arn }
output "alb_dns_name"          { value = aws_lb.main.dns_name }
output "https_listener_arn"    { value = aws_lb_listener.https.arn }
