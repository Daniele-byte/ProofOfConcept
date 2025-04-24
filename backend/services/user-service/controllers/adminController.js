const { User } = require("../models/userModel");

const fetchOrder = async (req, res) => {
try {
    console.log("Al backend arriva l'utente:", req.params.userId);
    const user = await User.findById(req.params.userId).select(
      "username email"
    ); // Seleziona solo l'email
    console.log("Email: ", user);
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero dell'utente", error });
  }
}

module.exports = { fetchOrder };