const jwt = require('jsonwebtoken');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001/api/users";

// 📌 Middleware per la protezione delle rotte
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decodifica il token senza bisogno del DB locale
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id }; // Salviamo solo l'ID utente

      next();
    } catch (error) {
      res.status(401).json({ message: 'Non autorizzato, token non valido' });
    }
  } else {
    res.status(401).json({ message: 'Non autorizzato, nessun token' });
  }
};

// 📌 Middleware per verificare se l'utente è admin
const adminOnly = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(403).json({ message: "Accesso negato: nessun utente autenticato" });
  }

  try {
    // Richiesta HTTP a user-service per ottenere i dettagli dell'utente
    const { data } = await axios.get(`${USER_SERVICE_URL}/${req.user.id}`, {
      headers: { Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}` }
    });

    if (data.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Accesso negato: solo gli admin possono eseguire questa operazione" });
    }
  } catch (error) {
    console.error("Errore nel controllo admin:", error.message);
    res.status(500).json({ message: "Errore nel controllo admin", error: error.message });
  }
};

module.exports = { protect, adminOnly };
