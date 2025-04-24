

const express = require('express');
const { createOrder, getAllOrders, getOrderStatus, updateOrderStatus, getUserOrders , getOrderDetails} = require('../controllers/orderController');

const router = express.Router();

router.post('/create', (req, res) => {
    // I dati di orderData sono già nel corpo della richiesta
    const orderData = req.body;  // Order data già incluso nel corpo della richiesta
  
    console.log("Dati ordine ricevuti:", orderData);  // Verifica che i dati siano corretti
  
    // Passa direttamente i dati alla funzione di creazione dell'ordine
    createOrder(orderData, res);  
  });
  
router.get('/getAll', getAllOrders);
router.patch('/update/:orderId', updateOrderStatus);
router.get('/my-order/:userId',getUserOrders)
router.get('/orders/:orderId', getOrderDetails)

// Endpoint per il controllo della salute del servizio
router.get('/health', (req, res) => {
  console.log("✅ Health check ricevuto!");
  res.status(200).json({ status: 'OK' });
});


module.exports = router;


