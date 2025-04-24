resource "aws_ecs_service" "shipment_service" {
  name            = "shipment-service"
  cluster         = aws_ecs_cluster.microservices.id
  task_definition = aws_ecs_task_definition.shipment_service.arn
  launch_type     = "FARGATE"

  desired_count = 1 # 0 se non voglio avviare i task

  network_configuration {
    subnets          = var.logistic_subnet_ids
    security_groups  = [var.ecs_sg_id]
    assign_public_ip = true
  }

}
