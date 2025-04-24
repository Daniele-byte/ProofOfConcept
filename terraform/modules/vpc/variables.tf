variable "vpc_cidr_block" {
  description = "CIDR block per la VPC"
  type        = string
}

variable "availability_zones" {
  description = "Zone di disponibilità"
  type        = list(string)
}

variable "subnet_cidr_blocks" {
  description = "CIDR block per le subnet"
  type        = list(string)
}
