// shipmentModel.js
const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    // reference a "orders" potrei fare con
    // ref: "Order"
  },
  userId:{
    type: String,
    required: true,
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    default: "in-preparazione" // Altri stati possibili: "in-transito", "consegnato", ecc.
  },
  destinationAddress: {
    type: String,
    default: "Via Festa del Perdono, 7",
    required: true
  },
  // Posizione corrente del pacco (lat, lng), utile per la mappa
  currentLocation: {
    type: {
      type: String, 
      enum: ["Point"], 
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0] // [long, lat] standard GeoJSON
    }
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

// Aggiorna automaticamente la data di aggiornamento
shipmentSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
