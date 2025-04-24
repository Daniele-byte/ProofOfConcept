variable "vpc_cidr_block" {
  description = "CIDR block per la VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Zone di disponibilità per la VPC"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "subnet_cidr_blocks" {
  description = "CIDR block per le subnet"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"] # Aggiunto un terzo CIDR
}

variable "docdb_master_username" {
  description = "Master username per DocumentDB"
  default     = "logistic_admin"
}

variable "docdb_master_password" {
  description = "Master password per DocumentDB"
  default     = "MT8O846iDcJnK7"
}

variable "certificate_arn" {
  description = "ARN del certificato SSL per l'ALB"
  type        = string
  default     = "arn:aws:acm:us-east-1:851725457775:certificate/663fb6b8-8e0c-480d-a29b-314e0dd2ea98" #Certificato self-signed
}

variable "bastion_key_name" {
  description = "Nome della key pair per il Bastion Host"
  type        = string
  default     = "SSH Key BH"
}


#s3-bucket
variable "environment" {
  description = "Ambiente di deploy (es. dev, staging, prod)"
  type        = string
  default     = "dev"
}

#alb: microservices-alb-216051693.us-east-1.elb.amazonaws.com"



