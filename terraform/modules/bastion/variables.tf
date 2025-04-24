variable "vpc_id" {
  description = "ID della VPC in cui deployare il Bastion Host"
  type        = string
}

variable "subnet_id" {
  description = "ID della subnet pubblica dove creare il Bastion Host"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR da cui permettere connessioni SSH (es. il tuo IP in formato X.X.X.X/32)"
  type        = string
}

variable "key_name" {
  description = "Nome della key pair per l’accesso SSH all’istanza EC2"
  type        = string
}

variable "instance_type" {
  description = "Tipo di istanza EC2 per il Bastion Host"
  type        = string
  default     = "t2.micro"
}

variable "instance_name" {
  description = "Nome per il tag dell’istanza Bastion"
  type        = string
  default     = "bastion-host"
}

