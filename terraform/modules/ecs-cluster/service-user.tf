resource "aws_ecs_service" "user_service" {
  name            = "user-service"
  cluster         = aws_ecs_cluster.microservices.id
  task_definition = aws_ecs_task_definition.user_service.arn
  launch_type     = "FARGATE"

  desired_count   = 1 
   network_configuration {
    subnets         = var.logistic_subnet_ids
    security_groups = [var.ecs_sg_id]
    assign_public_ip = true
  }

  #Gli assegno l'ALB (senza API-GW)
  /*
  load_balancer {
    target_group_arn = aws_lb_target_group.user_service_tg.arn
    container_name   = "user-service"
    container_port   = 3000
  }
  
   depends_on = [
    aws_lb.microservices_alb,
    aws_lb_target_group.user_service_tg
  ]*/
  
}
