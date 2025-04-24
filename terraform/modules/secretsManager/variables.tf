variable "secret_name" {
  description = "Nome del secret in AWS Secrets Manager"
  type        = string
}
#docdb credentials ad esempio

variable "description" {
  description = "Descrizione secret"
  type        = string
  default     = "Secret gestito da Terraform"
}

variable "secret_data" {
  description = "Mappa dei dati da memorizzare nel secret (es. { username, password })"
  type        = map(string)
  sensitive   = true
}
