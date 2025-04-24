const { User, passwordRegex } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const chalk = require('chalk'); // Importa chalk

// Genera token JWT includendo id e role
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' }); //modifica bopla includendo anche role
};

// Registrazione utente
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (userExists || usernameExists) {
      return res.status(400).json({ message: 'Utente già registrato' });
    }

    // Controllo se è il primo utente del sistema
    const isFirstUser = (await User.countDocuments()) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // Creazione dell'utente
    const user = new User({ username, email, password, role });
    await user.save();

    console.log(`✅ Utente creato: ${user.username} (Ruolo: ${role})`);

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role,
      token: generateToken(user),
    });

  } catch (error) {
    console.error('Errore nella registrazione:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
};

// Login utente b2b..
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Cerca l'utente in base all'email
    console.log("Utente QUERYYYY:", user);
  
    if (user && (await user.matchPassword(password))) { // Verifica se la password corrisponde
      console.log(chalk.green("Accesso effettuato con successo"));
      // Verifico se l'utente è admin
      const isAdmin = user.role === 'admin';

      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin,
        token: generateToken(user),
      });
    } else {
      console.log(chalk.red("Tentativo di accesso:\n", JSON.stringify({ email, password }, null, 2)));
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accesso negato: solo gli admin possono eseguire questa operazione" });
  }
  next();
};

module.exports = { registerUser, loginUser };
