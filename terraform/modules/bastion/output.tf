output "bastion_public_ip" {
  description = "Indirizzo IP pubblico del Bastion Host"
  value       = aws_instance.bastion.public_ip
}
