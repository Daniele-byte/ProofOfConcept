variable "ecs_cluster_id" {
  description = "ID dell'ECS Cluster dove verrà deployato Kong"
  type        = string
}

variable "subnets" {
  description = "Lista di subnet dove lanciare il servizio Fargate"
  type        = list(string)
}

variable "security_groups" {
  description = "Security group da associare al servizio"
  type        = list(string)
}

variable "region" {
  description = "Regione AWS"
  type        = string
}

variable "desired_count" {
  description = "Numero di task desiderati"
  type        = number
  default     = 1
}

variable "kong_target_group_arn" {
  description = "ARN del target group ALB per Kong (se applicabile)"
  type        = string
  default     = ""
}
/*
variable "kong_admin_target_group_arn" {
  description = "ARN del target group per Kong Admin API"
  type        = string
}

variable "kong_manager_target_group_arn" {
  description = "ARN del target group per Kong Manager UI"
  type        = string
}
*/
