output "docdb_cluster_endpoint" {
  description = "Endpoint del cluster DocumentDB"
  value       = aws_docdb_cluster.logistic.endpoint
}
