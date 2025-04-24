output "alb_dns_name" {
  value = aws_lb.microservices_alb.dns_name
}

output "alb_zone_id" {
  value = aws_lb.microservices_alb.zone_id
}

output "cluster_id" {
  description = "ID dell'ECS Cluster"
  value       = aws_ecs_cluster.microservices.id
}

output "kong_tg_arn" {
  description = "ARN del target group per Kong"
  value       = aws_lb_target_group.kong_tg.arn
}
/*
output "kong_admin_tg_arn" {
  description = "ARN del target group per Kong_ADMIN"
  value       = aws_lb_target_group.kong_admin_tg.arn
}
output kong_manager_tg_arn {
  description = "ARN del target group per Kong_MANAGER"
  value       = aws_lb_target_group.kong_manager_tg.arn
}
*/