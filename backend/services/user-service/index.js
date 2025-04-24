require("dotenv").config(); // Carica le variabili di ambiente
const express = require("express"); // Importa Express
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const { auth } = require("express-openid-connect"); // OpenID Connect
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const swaggerDocs = require("./swagger");

const app = express(); // Inizializza Express

// Abilita trust proxy, importante se usi un ALB per terminare TLS
app.set("trust proxy", true);

// Log delle variabili di ambiente per debugging
console.log("OIDC Client ID:", process.env.OIDC_CLIENT_ID);
console.log("OIDC Client Secret:", process.env.OIDC_CLIENT_SECRET);
console.log("OIDC Issuer:", process.env.OIDC_ISSUER);
console.log("OIDC Redirect URI:", process.env.OIDC_REDIRECT_URI);

// Carica i certificati SSL (locale)
/*
const options = {
  key: fs.readFileSync('./certs/user-service.localhost-key.pem'),
  cert: fs.readFileSync('./certs/user-service.localhost.pem'),
};
*/

// 🔹 Configura le opzioni CORS
const corsOptions = {
  origin: [
    "https://localhost",
    "https://localhost:3001",
    "https://microservices-alb-216051693.us-east-1.elb.amazonaws.com",
    "https://app.swaggerhub.com",
  ], // Aggiungi tutte le origini richieste (mio ip pubblico e porta frontend)
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 🔹 Necessario se usi autenticazione con cookie/token
};
// 🔹 Middleware CORS deve essere PRIMA di auth OpenID
app.use(cors(corsOptions));
//PROBLEMA BURPSUITE : gestisce esplicitamente le richieste preflight (le richieste HTTP OPTIONS fatte dal browser prima di inviare la richiesta effettiva) per tutte le rotte.
app.options("*", cors(corsOptions)); // Aggiungi questa linea per gestire le richieste preflight

// 🔹 Debug Origin delle richieste per capire se CORS funziona
/*app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});*/

// Configurazione OpenID Connect
const oidcConfig = {
  authRequired: false, // Permette di accedere a rotte pubbliche senza autenticazione.
  auth0Logout: true,
  secret: process.env.OIDC_CLIENT_SECRET,
  baseURL: "https://localhost:3001",
  clientID: process.env.OIDC_CLIENT_ID,
  issuerBaseURL: process.env.OIDC_ISSUER,
};

// 🔹 Middleware di autenticazione OpenID
//app.use(auth(oidcConfig));

// Connessione al database
connectDB();

// 🔹 Middleware per gestire JSON di grandi dimensioni
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔹 Documentazione Swagger
swaggerDocs(app);

// 🔹 Rotte API
app.use("/api/auth", authRoutes);
app.use((err, req, res, next) => {
  console.error("Errore non gestito:", err);

  // Aggiungi gli header CORS anche nelle risposte di errore
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(err.status || 500).json({ error: "Errore interno del server" });
});

// Usa la porta definita in .env o di default
const PORT = process.env.PORT || 3000;

// Avvio del server HTTP (senza gestire HTTPS all'interno del container) ci pensa ALB alla terminazione TLS
app.listen(PORT, () => {
  console.log(`✅ Server HTTP attivo su http://0.0.0.0:${PORT}`);
  console.log(`📜 Swagger disponibile su http://0.0.0.0:${PORT}/api-docs`);
  console.log("ENV VARIABLES:", process.env);
});
