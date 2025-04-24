resource "aws_ecr_repository" "user_service" {
  name = "user-service-repo"
}
resource "aws_ecr_repository" "order_service" {
  name = "order-service-repo"
}
resource "aws_ecr_repository" "shipment_service" {
  name = "shipment-service-repo"
}
resource "aws_ecr_repository" "kong-gateway-service" {
  name = "kong-gateway-service"
}
