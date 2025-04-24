# Recupera la versione del secret usando il docdb_secret_id passato come variabile
data "aws_secretsmanager_secret_version" "docdb_credentials" {
  secret_id = var.docdb_secret_id
}

resource "aws_docdb_subnet_group" "docdb_subnet_group" {
  name       = "logistic-docdb-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "logistic-docdb-subnet-group"
  }
}

resource "aws_docdb_cluster" "logistic" {
  cluster_identifier     = var.cluster_identifier
  engine                 = var.engine
  master_username        = jsondecode(data.aws_secretsmanager_secret_version.docdb_credentials.secret_string)["username"]
  master_password        = jsondecode(data.aws_secretsmanager_secret_version.docdb_credentials.secret_string)["password"]
  vpc_security_group_ids = [var.docdb_sg_id]
  db_subnet_group_name   = aws_docdb_subnet_group.docdb_subnet_group.name
  skip_final_snapshot = true
  tags = {
    Name = "logistic-docdb-cluster"
  }
}

resource "aws_docdb_cluster_instance" "logistic_instances" {
  count              = var.docdb_instance_count
  cluster_identifier = aws_docdb_cluster.logistic.id
  instance_class     = var.docdb_instance_class
  engine             = var.engine

  tags = {
    Name = "logistic-docdb-instance-${count.index}"
  }
}
