output "secret_id" {
  description = "L'ID del secret creato in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.this.id
}

output "secret_arn" {
  description = "L'ARN del secret creato in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.this.arn
}
