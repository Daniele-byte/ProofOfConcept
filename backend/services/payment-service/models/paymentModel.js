const mongoose = require('mongoose');

//Richiesta di pagamento che Stripe segue il payment Intents quindi ho un paymentIntents id
//OrderId facoltativo , viene aggiornato appena il pagamento è concluso!!
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true, // Rendi obbligatorio l'orderId
    unique: true
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'eur'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
