variable "profile_bucket_name" {
  description = "Il nome univoco del bucket S3 per le foto profilo"
  type        = string
}

variable "environment" {
  description = "Ambiente di deploy (es. dev, staging, prod)"
  type        = string
}
