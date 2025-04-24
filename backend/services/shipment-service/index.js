require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); // Importa il pacchetto cors
const shipmentsRoutes = require("./routes/shipmentRoutes");
const fs = require('fs'); //Add
const https = require('https'); //Add
const swaggerDocs = require("./swagger");

const app = express();
// Abilita trust proxy, importante se usi un ALB per terminare TLS
app.set('trust proxy', true);

//add
// Carica i certificati SSL (assicurati di avere i file) 
/*const options = {
  key: fs.readFileSync('./certs/shipment-service.localhost-key.pem'),
  cert: fs.readFileSync('./certs/shipment-service.localhost.pem'),
};
*/
const corsOptions = {
  origin: ['https://localhost', 'https://localhost:3001','https://microservices-alb-216051693.us-east-1.elb.amazonaws.com'], // Consenti richieste solo da questo dominio
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Metodi consentiti
  allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti
};

app.use(cors(corsOptions)); // Usa CORS con le opzioni
//PROBLEMA BURPSUITE : gestisce esplicitamente le richieste preflight (le richieste HTTP OPTIONS fatte dal browser prima di inviare la richiesta effettiva) per tutte le rotte.
app.options('*', cors(corsOptions)); // Aggiungi questa linea per gestire le richieste preflight

// Connessione al DB
connectDB();
// Middleware
app.use(express.json());

// 🔹 Intercetta errori JSON non validi
/*app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Errore di parsing JSON:", err);
    return res.status(400).json({ 
      success: false, 
      message: "Formato JSON non valido. Controlla la sintassi della richiesta." 
    });
  }
  next();
});
*/

app.use('/api/shipments', shipmentsRoutes);
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

// 🔹 Documentazione Swagger
swaggerDocs(app);



// Avvio del server
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`✅ Server HTTP attivo su http://0.0.0.0:${PORT}`);
  console.log(`📜 Swagger disponibile su http://0.0.0.0:${PORT}/api-docs`);
  console.log("ENV VARIABLES:", process.env);
});

