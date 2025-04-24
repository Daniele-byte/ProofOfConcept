# Creazione della VPC
resource "aws_vpc" "logistic_vpc" {
  cidr_block = var.vpc_cidr_block
  tags = {  
    Name = "logistic-vpc"
  }
}

# Creazione delle subnet (come pubbliche)
resource "aws_subnet" "logistic_subnet" {
  count = length(var.availability_zones)

  cidr_block           = element(var.subnet_cidr_blocks, count.index)
  vpc_id               = aws_vpc.logistic_vpc.id
  availability_zone    = element(var.availability_zones, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "logistic-subnet-${count.index}"
  }
}

# Creazione del Security Group per ECS e DocumentDB
resource "aws_security_group" "ecs_sg" {
  name        = "logistic-ecs-sg"
  description = "Security group for ECS"
  vpc_id      = aws_vpc.logistic_vpc.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "logistic-ecs-sg"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "logistic_igw" {
  vpc_id = aws_vpc.logistic_vpc.id

  tags = {
    Name = "logistic-igw"
  }
}

# Route Table
resource "aws_route_table" "logistic_route_table" {
  vpc_id = aws_vpc.logistic_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.logistic_igw.id
  }

  tags = {
    Name = "logistic-route-table"
  }
}

# Associazione della Route Table alle Subnet
resource "aws_route_table_association" "logistic_subnet_association" {
  count          = length(aws_subnet.logistic_subnet)
  subnet_id      = aws_subnet.logistic_subnet[count.index].id
  route_table_id = aws_route_table.logistic_route_table.id
}

#SECURITY GROUP DELL'APPLICATION LOAD BALANCER
resource "aws_security_group" "alb_sg" {
  name        = "microservices-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.logistic_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # per la porta 80 (HTTP)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "microservices-alb-sg"
  }
}
