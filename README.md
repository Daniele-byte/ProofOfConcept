# Logistic System 🚚📦

**Logistic System** è una piattaforma **microservizi** per la gestione di flussi logistici: utenti, ordini, pagamenti e molto altro.  
I servizi sono containerizzati con **Docker**, orchestrati in locale con **Docker Compose**, mentre in AWS vengono eseguiti su **ECS** (con immagini ospitate in **ECR**).  
Per la persistenza dati si usa **MongoDB** (sia in locale che in cloud, a seconda del servizio).

![Architettura del sistema](https://github.com/user-attachments/assets/2cac6edb-ead6-4da7-9f93-49a01d2dad88)

---

## 📖 Sommario

- [Features](#-features)  
- [Architettura](#-architettura)  
- [Tecnologie](#-tecnologie)  
- [Prerequisiti](#-prerequisiti)  
- [Avvio in locale](#-avvio-in-locale)  
- [Deploy in AWS](#-deploy-in-aws)  
- [Uso](#-uso)  
- [Autori & Licenza](#-autori--licenza)  

---

## ✨ Features

- **User Service**: gestione utenti, autenticazione e profili  
- **Order Service**: creazione, aggiornamento e tracking ordini  
- **Payment Service**: integrazione con Stripe per pagamenti  
- **Shipment Service**: gestione spedizioni e tracking  
- **Warehouse Service**: inventario magazzino  
- Frontend in **React** per dashboard e interfaccia utente  
- Infrastructure-as-Code con **Terraform**  

---

## 🏗 Architettura

- Ogni servizio è un container Docker  
- In locale, tutti i container sono orchestrati da Docker Compose  
- In cloud, **User** e **Order Service** girano su AWS ECS; tutti gli altri possono essere migrati facilmente  
- Database **MongoDB** per ogni servizio (deploy locali o cluster Atlas)  
- Rete VPC, Security Group e Load Balancer gestiti via Terraform  

---

## 🛠 Tecnologie

| Livello            | Tool / Framework                   |
|--------------------|------------------------------------|
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
