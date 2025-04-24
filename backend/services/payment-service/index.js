require('dotenv').config();
const express = require('express');
const fs = require('fs'); //Add
const cors = require('cors'); // Importa il pacchetto cors
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');
const https = require('https'); //Add

const app = express();
// Carica i certificati SSL
const options = {
    key: fs.readFileSync('./certs/payment-service.localhost-key.pem'),
    cert: fs.readFileSync('./certs/payment-service.localhost.pem'),
  };


const corsOptions = {
    origin: ['https://localhost', 'https://localhost:3001'], // Consenti richieste solo dal frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
connectDB();
app.use(express.json());

app.use('/api/payment', paymentRoutes);

const PORT = process.env.PAYMENT_SERVICE_PORT || 3005;

// Avvia il server HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`Payment Service is running on https://localhost:${PORT}`);
});
