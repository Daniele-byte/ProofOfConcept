require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); // Importa il pacchetto cors
const connectDB = require('./config/db');
const warehouseRoutes = require("./routes/warehouseRoutes");
const fs = require('fs'); //Add
const https = require('https'); //Add


const app = express();
//add
// Carica i certificati SSL (assicurati di avere i file) 
const options = {
  key: fs.readFileSync('./certs/warehouse-service.localhost-key.pem'),
  cert: fs.readFileSync('./certs/warehouse-service.localhost.pem'),
};

const corsOptions = {
    origin: ['https://localhost', 'https://localhost:3001'], // Aggiungi tutte le origini richieste
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Metodi consentiti
    allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti
  };

app.use(cors(corsOptions)); // Usa CORS con le opzioni


connectDB();

app.use(express.json());

// Rotte per la gestione del magazzino
app.use('/admin/warehouse', warehouseRoutes);

const PORT = process.env.WAREHOUSE_SERVICE_PORT || 3002;

https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ Server HTTPS attivo su https://localhost:${PORT}`);
  console.log(`📜 Swagger disponibile su https://localhost:${PORT}/api-docs`);
});


