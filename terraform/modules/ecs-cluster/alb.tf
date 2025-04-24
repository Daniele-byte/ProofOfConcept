#Application load balancer


##############################
# ALB
##############################
resource "aws_lb" "microservices_alb" {
  name               = "microservices-alb"
  load_balancer_type = "application"
  security_groups    = [var.alb_sg_id]
  subnets            = var.logistic_subnet_ids

  tags = {
    Name = "microservices-alb"
  }
}

/*
##############################
# Target Group per user-service
##############################
resource "aws_lb_target_group" "user_service_tg" {
  name        = "user-service-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/api/auth/health" # Assicurati di avere questo endpoint nel servizio
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}

##############################
# Target Group per order-service
##############################
resource "aws_lb_target_group" "order_service_tg" {
  name        = "order-service-tg"
  port        = 3003
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
  depends_on  = [aws_lb.microservices_alb] # Forzatura della dipendenza dall'ALB

  health_check {
    path                = "/admin/orders/health"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}
*/

##############################
# Target Group per Kong (API Gateway) - Proxy
##############################
resource "aws_lb_target_group" "kong_tg" {
  name        = "kong-tg"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/health" #curl -k -X GET https://microservices-alb-216051693.us-east-1.elb.amazonaws.com/health
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}
/*
#KONG- ADMIN
resource "aws_lb_target_group" "kong_admin_tg" {
  name        = "kong-admin-tg"
  port        = 8001
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/kong-admin"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}
#KONG - MANAGER
resource "aws_lb_target_group" "kong_manager_tg" {
  name        = "kong-manager-tg"
  port        = 8002
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/kong-manager"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}
*/

##############################
# Listener HTTPS
##############################
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.microservices_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   =  var.certificate_arn

  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong_tg.arn  # Inoltra tutto a Kong
  }

  depends_on = [ var.certificate_arn ]
}

/*
##############################
# Listener Rule per Kong Admin (8001)
##############################
resource "aws_lb_listener_rule" "kong_admin_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong_admin_tg.arn
  }

  condition {
    path_pattern {
      values = ["/kong-admin/*"]  # Usa /admin/ per accedere a Kong Admin
    }
  }
}

##############################
# Listener Rule per Kong Manager (8002)
##############################
resource "aws_lb_listener_rule" "kong_manager_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong_manager_tg.arn
  }

  condition {
    path_pattern {
      values = ["/kong-manager/*"]  # Usa /manager/ per accedere a Kong Manager
    }
  }
}
*/

##############################
# Listener HTTP
##############################
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.microservices_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      protocol    = "HTTPS"
      port        = "443"
      status_code = "HTTP_301"
    }
  }

  depends_on = [aws_lb.microservices_alb] # Forza la dipendenza dall'ALB
}

/*
Rimuovo poichè non servono più ormai se ne occupa Kong
##############################
# Listener Rule per user-service
##############################
resource "aws_lb_listener_rule" "user_service_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 5

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.user_service_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/auth/*"]
    }
  }

  depends_on = [aws_lb_listener.https]
}

##############################
# Listener Rule per order-service
##############################
resource "aws_lb_listener_rule" "order_service_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.order_service_tg.arn
  }

  condition {
    path_pattern {
      values = ["/admin/orders/*"]
    }
  }

  depends_on = [aws_lb_listener.https]
}
*/