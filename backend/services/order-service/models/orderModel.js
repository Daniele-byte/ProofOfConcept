const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { 
        type: String,
        required: true,
        unique: true
    },
    userId: { 
        type: String, 
        required: true,
        index: true  // Aggiungi un indice per userId
    },
    cartItems: [ // Array di oggetti, ciascuno rappresenta un articolo nel carrello
        {
          productId: { type: String, required: true }, // ID del prodotto
          name: { type: String, required: true }, // Nome del prodotto
          quantity: { type: Number, required: true }, // Quantità ordinata
          price: { type: Number, required: true }, // Prezzo per unità
        }
      ],
    status: { 
        type: String, 
        enum: ['creato', 'pagato', 'annullato', 'evaso'], 
        default: 'creato' 
    },
    subTotal: { 
        type: Number, 
        required: true 
      },
      shippingCost: { 
        type: Number, 
        required: true 
      },
      totalAmount: { 
        type: Number, 
        required: true 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
      updatedAt: { 
        type: Date, 
        default: Date.now 
      }
    });
    

module.exports = mongoose.model('Order', orderSchema);
