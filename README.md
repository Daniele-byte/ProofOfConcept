# Logistic System

This project is a **microservices-based logistics system** designed to manage different services such as **User Service**, **Order Service**, **Payment Service**, and more. The services are containerized using **Docker**, and the infrastructure is managed using **AWS** (ECS, ECR, etc.), while local development is facilitated by **Docker Compose**. The application uses **MongoDB** for all the services except those deployed in the cloud.
![image](https://github.com/user-attachments/assets/2cac6edb-ead6-4da7-9f93-49a01d2dad88)

## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Local Development Setup](#local-development-setup)
- [Cloud Setup (AWS)](#cloud-setup-aws)
- [Usage](#usage)
- [License](#license)

## Description

This project aims to implement a **logistics system** with a **microservices architecture** to manage various aspects of a logistics system, such as user management, order processing, payment processing, and more. The services are implemented using **Node.js** and **Express** for the backend, while the frontend is built using **React**. All the services are connected to **MongoDB** (except for cloud-hosted services).

- **User Service** and **Order Service** will be hosted in **AWS ECS** (in the cloud).
- The remaining services will be run locally for development purposes.

## Technologies

### Backend:
- **Node.js**: JavaScript runtime environment used for building scalable backend services.
- **Express.js**: Web framework for Node.js to build RESTful APIs.
- **MongoDB**: NoSQL database used for storing data. MongoDB is used in all the services except for those running in the cloud.
- **Nodemon**: Development tool that automatically restarts the server when changes are detected in the code, improving the development workflow.
- **Axios**: Promise-based HTTP client used for making API requests from the frontend to the backend.

### Frontend:
- **React**: JavaScript library for building user interfaces, specifically for building the frontend of this logistics system.
- **Axios**: Used for making HTTP requests from the frontend to backend APIs.
- **Nginx**: Used for serving the frontend in production (configured via `nginx.conf`).

### Containerization:
- **Docker**: Used for containerizing the backend services and frontend to ensure consistency across different environments.
- **Docker Compose**: Used to run multiple services (microservices) in development locally.

### Cloud Infrastructure:
- **AWS ECS (Elastic Container Service)**: Used to run **User Service** and **Order Service** in the cloud.
- **AWS ECR (Elastic Container Registry)**: Used to store Docker images for the services.
- **AWS VPC**: Virtual Private Cloud configuration for managing network resources.
- **Terraform**: Used for automating the provisioning and management of AWS infrastructure.

### Development Tools:
- **Git**: Version control system for tracking changes in the codebase.
- **Postman**: API testing tool used for testing backend services and APIs.
- **VSCode**: Code editor for development, with extensions for Docker, MongoDB, and Terraform.

## Local Development Setup

To run the project locally, you need to have **Docker**, **Docker Compose**, and **Node.js** installed. Follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Daniele-byte/logistic-system.git
   cd logistic-system```

## License

This project is proprietary and confidential. All rights are reserved by the author.

For full licensing information, please refer to the [LICENSE](./LICENSE) file.
