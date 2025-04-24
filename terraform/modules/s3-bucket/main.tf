resource "aws_s3_bucket" "profile_photos" {
  bucket = var.profile_bucket_name  # Ad esempio "my-profile-photos-bucket-<univoco>"
}


# (Opzionale) Abilitare il versioning per tenere traccia delle modifiche alle foto
resource "aws_s3_bucket_versioning" "profile_photos_versioning" {
  bucket = aws_s3_bucket.profile_photos.id
  versioning_configuration {
    status = "Enabled"
  }
}
