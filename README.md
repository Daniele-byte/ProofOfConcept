# Logistic System 🚚📦

**Logistic System** è una piattaforma basata su **microservizi** per la gestione di flussi logistici: utenti, ordini, pagamenti, spedizioni etc.  
I servizi sono containerizzati con **Docker**, orchestrati in locale con **Docker Compose**, mentre in AWS vengono eseguiti su **ECS**  ( nella fattispecie viene utilizzato **AWS Fargate** con immagini ospitate in **ECR**).  
Per la persistenza dati si usa **MongoDB** in locale; **DocumentDB** in cloud, a seconda del microservizio.

![Architettura del sistema](./PoC_Infrastructure.png)

---

## 📖 Sommario

- [Features](#-features)
- [Architettura](#-architettura)
- [Tecnologie](#-tecnologie)
- [Prerequisiti](#%EF%B8%8F-prerequisiti)
- [Avvio in locale](#%EF%B8%8F-avvio-in-locale)
- [Deploy in AWS](#%EF%B8%8F-deploy-in-aws)
- [Autori & Licenza](#license)


---

## ✨ Features

- **Kong Gateway**: API Gateway per instradamento, sicurezza (JWT, rate limiting, autenticazione e monitoraggio delle chiamate API) configurato come Policy as Code (kong.yml)
- **User Service**: Gestione utenti, autenticazione e profili
- **Order Service**: Creazione, aggiornamento e tracking ordini 
- **Payment Service**: Integrazione con Stripe per pagamenti
- **Shipment Service**: Gestione spedizioni e tracking
- **Warehouse Service**: Inventario magazzino
- **Frontend** in **React** per dashboard e interfaccia utente  
- Infrastructure-as-Code con **Terraform**

---

## 🏗 Architettura

- **Kong Gateway** funge da ingresso centralizzato: gestisce instradamento ai microservizi, autenticazione, autorizzazione, rate limiting e monitoraggio delle chiamate API
- Ogni microservizio è un container Docker  
- In locale, tutti i container sono orchestrati da Docker Compose  
- In cloud, **User Service**, **Order Service**, **Shipment Service** girano su AWS ECS; tutti gli altri possono essere migrati facilmente o posti in CSP diversi.  
- Database **MongoDB** per ogni microservizio on premise (**Warehouse management Service**, **Payment Service**)
- Database **DocumentDB** in cloud per microservizi on cloud (**User Service**, **Order Service**, **Shipment Service**)
- Rete VPC, Security Group, Bastion Host, ECR Repository, ECS CLuster, Kong Gateway, S3 Bucket, Secrets Manager e Load Balancer gestiti via Terraform  

---

## 🛠 Tecnologie

| Livello            | Tool / Framework                   |
|--------------------|------------------------------------|
| **Kong Gateway**   | Kong Gateway (plugin Lua custom per sicurezza)   |
| **Backend**        | Node.js, Express, Nodemon, Axios   |
| **Frontend**       | React, Axios, Nginx                |
| **DB**             | MongoDB                            |
| **Container**      | Docker, Docker Compose             |
| **Cloud**          | AWS ECS, ECR, VPC                  |
| **IaC**            | Terraform                          |
| **DevOps & Tools** | Git, Postman, VSCode (+ estensioni Docker, MongoDB, Terraform) |

---

## ⚙️ Prerequisiti

- **Git**  
- **Docker & Docker Compose**  
- **Node.js** (v14+)  
- **Terraform** (per il deploy AWS)  
- Credenziali AWS con accesso a ECS, ECR e VPC  

---

## ▶️ Avvio in locale

1. Clona il repo  
   ```bash
   git clone https://github.com/Daniele-byte/logistic-system.git
   cd logistic-system
2. Crea il file .env in ciascun microservice (es. backend/services/payment-service/.env) con le tue variabili:
   ```bash
   MONGO_URI=mongodb://localhost:27017/<db>
   STRIPE_SECRET_KEY=sk_test_...
   JWT_SECRET=tuo_jwt_secret
3. Avvia i container:
   ```bash
   docker-compose up --build
4. Apri il frontend: https://localhost:3000

---

## ☁️ Deploy in AWS
1. Inserimento credenziali AWS
   ```bash
   aws configure
2. Provisioning infrastruttura
   ```bash
   cd terraform
   terraform init
   terraform apply -auto-approve
3. Verifica modifiche su ECS
   Controlla la console AWS ECS per lo stato dei task e dei container

---

## License

This project is proprietary and confidential. All rights are reserved by the author.

For full licensing information, please refer to the [LICENSE](./LICENSE) file.


