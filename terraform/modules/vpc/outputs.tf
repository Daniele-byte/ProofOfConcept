output "logistic_subnet_ids" {
  value = aws_subnet.logistic_subnet[*].id
}

output "ecs_sg_id" {
  value = aws_security_group.ecs_sg.id
}

output "alb_sg_id" {
  description = "ID del security group per l'ALB"
  value       = aws_security_group.alb_sg.id
}

output "vpc_id" {
  description = "ID della VPC"
  value       = aws_vpc.logistic_vpc.id
}