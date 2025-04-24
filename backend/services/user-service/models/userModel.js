


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Regex per validazione della password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new mongoose.Schema({
  oauthId: {
    type: String,
    unique: true,
    sparse: true, // Permette che l'ID OAuth sia unico ma non obbligatorio
    required: false // Può essere nullo se non si usa OAuth
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    //required: true, // La password è obbligatoria
    match: [passwordRegex, 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.']
  },
  profileImage: {
    type: String, // Salviamo l'URL dell'immagine
    required: false // Non obbligatorio, ma può essere fornito se l'utente carica una foto
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  } // Aggiunto il ruolo

}, {
  timestamps: true,
});


// Imposta la validazione solo sui campi modificati
userSchema.set('validateModifiedOnly', true);
/*Se aggiorni solo username, email e profileImage (senza password), il campo password non viene toccato e, grazie a validateModifiedOnly, Mongoose non lo valida */


// Middleware per assegnare un _id corretto (ObjectId se non c'è oauthId)
userSchema.pre('save', function (next) {
  if (this.oauthId) {
    // Usa oauthId come _id se presente
    this._id = this.oauthId;
  }
  // Non fare nulla se oauthId non è presente, MongoDB genererà un ObjectId automaticamente
  next();
});

// Middleware per l'hashing delle password


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metodo per comparare le password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



/* DOPO */



const User = mongoose.model('User', userSchema);

module.exports = { User, passwordRegex };
