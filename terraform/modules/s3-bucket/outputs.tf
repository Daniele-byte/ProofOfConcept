output "profile_bucket_name" {
  description = "Nome del bucket S3 per le foto profilo"
  value       = aws_s3_bucket.profile_photos.bucket
}
