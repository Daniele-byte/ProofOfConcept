require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Importa il pacchetto cors
const orderRoutes = require('./routes/orderRoutes');
const fs = require('fs'); //Add
const https = require('https'); //Add

const app = express();
// Abilita trust proxy, importante se usi un ALB per terminare TLS
app.set('trust proxy', true);

//add
// Carica i certificati SSL (assicurati di avere i file) 
/*const options = {
  key: fs.readFileSync('./certs/order-service.localhost-key.pem'),
  cert: fs.readFileSync('./certs/order-service.localhost.pem'),
};*/

const corsOptions = {
  origin: ['https://localhost', 'https://localhost:3001', 'https://microservices-alb-216051693.us-east-1.elb.amazonaws.com'], // Aggiungi tutte le origini richieste (mio ip pubblico e porta frontend)
  methods: ['GET', 'POST', 'PUT', 'PATCH'], // Metodi consentiti
  allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti
};

app.use(cors(corsOptions)); // Usa CORS con le opzioni
//PROBLEMA BURPSUITE : gestisce esplicitamente le richieste preflight (le richieste HTTP OPTIONS fatte dal browser prima di inviare la richiesta effettiva) per tutte le rotte.
app.options('*', cors(corsOptions)); // Aggiungi questa linea per gestire le richieste preflight

// Connessione al DB
connectDB();
// Middleware
app.use(express.json());

// Rotte
app.use('/admin/orders', orderRoutes);
/*Non fa andare in exit il container */
app.use((err, req, res, next) => {
  console.error("Errore non gestito:", err);

  // header CORS anche nelle risposte di errore
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  
  res.status(err.status || 500).json({ error: "Errore interno del server" });
});
app.use((req, res, next) => {
  console.log(`📩 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Avvio del server
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`✅ Server HTTP attivo su http://0.0.0.0:${PORT}`);
  console.log(`📜 Swagger disponibile su http://0.0.0.0:${PORT}/api-docs`);
  console.log("ENV VARIABLES:", process.env);
});


