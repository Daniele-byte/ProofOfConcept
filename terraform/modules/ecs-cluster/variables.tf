variable "logistic_subnet_ids" {
  description = "ID della subnet per ECS"
  type        = list(string)
}

variable "ecs_sg_id" {
  description = "ID del Security Group per ECS"
  type        = string
}



##alb
variable "vpc_id" {
  description = "ID della VPC"
  type        = string
}
variable "alb_sg_id" {
  description = "Security group per l'ALB"
  type        = string
}
variable "certificate_arn" {
  description = "ARN del certificato SSL per il listener HTTPS dell'ALB"
  type        = string
}
