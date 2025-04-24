const Order = require('../models/orderModel');

const createOrder = async (orderData, res) => {
    try {
    //  Validazione precedente:
    // const { orderId, userId, cartItems, subTotal, shippingCost, totalAmount, status } = orderData;
    const { orderId, userId, cartItems, status, signature } = orderData;
    console.log("ID utente:", userId);  // Verifica che l'ID utente arrivi correttamente
    console.log("orderId ricevuto:", orderId); // Verifica che orderId venga passato correttamente
    
/* 
Potrei controllare la signature lato backend ma lascio fare all'api
*/

    // Calcola il subTotal sommando price * quantity per ogni item
    const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    
    // Calcola lo shippingCost in base ad una logica di business
    // Imposta il costo di spedizione: 0 se subTotal > 1000, altrimenti 20
    const shippingCost = subTotal > 1000 ? 0 : 20;
    
    // Calcola il totale
    const totalAmount = subTotal + shippingCost;
    
      const newOrder = new Order({
        orderId,
        userId,
        cartItems,
        subTotal,
        shippingCost,
        totalAmount,
        status, // Lo stato iniziale dell'ordine
      });
  
      // Salva l'ordine nel database
      await newOrder.save();
  
      res.status(201).json({ message: 'Ordine creato con successo', order: newOrder });
    } catch (error) {
      console.error("Errore nella creazione dell'ordine:", error);
      res.status(500).json({ message: 'Errore nella creazione dell\'ordine', error });
    }
  };



// Ottieni tutti gli ordini
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find(); // Modifica per ottenere gli ordini
        console.log("Backend getAllOrders: ",orders)
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero degli ordini', error });
    }
};

// Ottieni lo stato di un ordine
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: 'Ordine non trovato' });
        }

        res.json({ status: order.status });
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dello stato dell\'ordine', error });
    }
};

// Aggiorna lo stato di un ordine
const updateOrderStatus = async (req, res) => {
    
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        console.log("BACKEEEND",orderId, status)
        const order = await Order.findOneAndUpdate(
            { orderId: orderId }, // 🔹 Cerca per orderId (campo del db)
            { status, updatedAt: Date.now() },
            { new: true }
        );
        console.log("Ordine trovato: ",order)
        

        if (!order) {
            return res.status(404).json({ message: 'Ordine non trovato' });
        }

        res.json({ message: 'Stato ordine aggiornato', order });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell’aggiornamento dello stato dell\'ordine', error });
    }
};

const getUserOrders = async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId });
  
      if (!orders.length) {
        return res.status(404).json({ message: 'Nessun ordine trovato per questo utente' });
      }

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero degli ordini', error });
    }
  };

  const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Richiesta dettagli per ordine:", orderId);

        // Cerca l'ordine nel database senza popolazioni (populate)
        const order = await Order.findOne({ orderId });
        console.log("Ho trovato BACKEEEND:" ,order)
        if (!order) {
            return res.status(404).json({ message: "Ordine non trovato" });
        }

        // Restituisci i dettagli dell'ordine senza popolare user e items.product
        res.json(order);
    } catch (error) {
        console.error("Errore nel recuperare i dettagli dell'ordine:", error);
        res.status(500).json({ message: "Errore nel recupero dell'ordine", error });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateOrderStatus,
    getUserOrders,
    getOrderDetails,
};
