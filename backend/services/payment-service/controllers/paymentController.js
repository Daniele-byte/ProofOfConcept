
const stripe = require('../config/stripe');
const Payment = require('../models/paymentModel');
const crypto = require('crypto');
// Chiave segreta per HMAC (conservata in modo sicuro, es. come variabile d'ambiente)
const HMAC_SECRET_KEY = process.env.HMAC_SECRET_KEY;
/**
 * Inizializza un pagamento creando un PaymentIntent su Stripe e restituisce il client secret
 */
const initiatePayment = async (req, res) => {
    try {
        const { userId, amount, currency = 'eur' , quantity} = req.body;

        console.log('Dati della richiesta di pagamento:', req.body);
        console.log("Prelevato userid:", userId);

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Importo non valido' });
        }

        // Crea un PaymentIntent su Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });

        console.log('PaymentIntent creato:', paymentIntent);
        
        // Genera un orderId univoco (ORD-<timestamp>)
        const orderId = `ORD-${Date.now()}`;

        // Salva il pagamento nel database includendo orderId..
        const payment = new Payment({
            orderId,
            userId,
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'pending',
        });

        await payment.save();

        // Calcolo la HMAC per la signature
        const dataString = `${orderId}|${userId}|${quantity}`;
        const hmacSignature = crypto.createHmac('sha256', HMAC_SECRET_KEY)
                                     .update(dataString)
                                     .digest('hex');

        // Restituisce il clientSecret, paymentId, e orderId
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id,
            orderId: payment.orderId,  // Restituisci l'orderId generato
            signature: hmacSignature  // Restituisco la signature HMAC
        });

    } catch (error) {
        console.error('Errore in initiatePayment:', error);
        res.status(500).json({ error: 'Errore nel pagamento' });
    }
};





module.exports = {initiatePayment }