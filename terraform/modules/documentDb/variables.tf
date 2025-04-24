
variable "docdb_secret_id" {
  description = "ID del secret in AWS Secrets Manager contenente le credenziali per DocumentDB"
  type        = string
}

variable "docdb_sg_id" {
  description = "ID del Security Group per DocumentDB"
  type        = string
}
variable "subnet_ids" {
  description = "List of subnet IDs for the DocumentDB subnet group"
  type        = list(string)
}

variable "cluster_identifier" {
  description = "Nome del cluster DocumentDB"
  type        = string
}

variable "engine" {
  description = "Tipo di engine per il cluster DocumentDB"
  type        = string
  default     = "docdb"
}

# Aggiunta per la configurazione delle istanze
variable "docdb_instance_class" {
  description = "Tipo di istanza per DocumentDB"
  type        = string
  default     = "db.t3.medium" # Imposta un valore predefinito per la classe dell'istanza
}

variable "docdb_instance_count" {
  description = "Numero di istanze DocumentDB"
  type        = number
  default     = 1 # Imposta il numero predefinito di istanze
}

