// shipmentController.js
const Shipment = require("../models/shipmentModel");

// Crea una nuova spedizione
const createShipment = async (req, res) => {
  try {
    const { orderId, userId, destinationAddress, currentLocation } = req.body; // ✅ Ora prendo currentLocation dal frontend
    
    // Genera un tracking number (qui banalmente con un timestamp)
    const trackingNumber = "TRACK-" + Date.now();

    const shipment = new Shipment({
      orderId,
      userId,
      trackingNumber,
      destinationAddress,
      currentLocation,
      status: "in-preparazione"
    });

    await shipment.save();

    return res.status(201).json({
      success: true,
      shipment
    });
  } catch (error) {
    console.error("Errore nella creazione della spedizione:", error);
    return res.status(500).json({
      success: false,
      message: "Errore interno del server"
    });
  }
};

// Recupera una spedizione partendo dall'orderId (Google maps)
const getShipmentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("Richiesta ricevuta per orderId:", req.params.orderId);
    // Cerca la spedizione con quell'orderId
    const shipment = await Shipment.findOne({ orderId: orderId });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Spedizione non trovata per questo orderId"
      });
    }

    return res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    console.error("Errore nel recupero della spedizione da orderId:", error);
    return res.status(500).json({
      success: false,
      message: "Errore interno del server"
    });
  }
};
module.exports = {
    createShipment, getShipmentByOrderId,
};
/*getShipmentById */