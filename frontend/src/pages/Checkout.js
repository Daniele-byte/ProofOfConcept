import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { getProfile, initiatePayment } from "../services/api"
import '../styles/checkout.css'; // Assicurati di avere il file CSS

const Checkout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await getProfile(token);
          if (response && response.user) {
            setUser(response.user); // Imposta i dati dell'utente
          }
        } catch (error) {
          console.error("Errore nel recupero del profilo:", error);
          alert("Errore nel recupero del profilo utente.");
        }
      } else {
        alert("Non sei autenticato!");
        navigate("/login"); // Redirige alla pagina di login se non c'è il token
      }
    };

    fetchProfile();
  }, [navigate]);

  // Calcola il subtotale, tenendo conto della quantità di ogni prodotto
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Imposta il costo di spedizione
  const shippingCost = subtotal > 1000 ? 0 : 20;  // Es: spedizione gratuita sopra i 1000€ altrimenti 20€

  const total = subtotal + shippingCost;  // Calcola il totale

  const handleOrder = async () => {
    const token = localStorage.getItem("token");

    if (!user) {
      alert("Utente non trovato! Impossibile completare l'ordine.");
      return;
    }
    
    /* CODICE CREA ORDINE! */
    const orderData = {
      userId: user._id, // Usa l'ID dell'utente loggato
      cartItems: cartItems,
      subTotal: subtotal,
      shippingCost: shippingCost,
      totalAmount: total,
    };

    // Salvo l'orderData in localStorage per usarlo dopo la conferma del pagamento
    localStorage.setItem("orderData", JSON.stringify(orderData));
    // Calcola la quantità totale (sommando la quantità di ogni prodotto)
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    /* CODICE STRIPE */
    // Includi orderId insieme agli altri dati del pagamento
    const paymentData = {
      userId: user._id,
      amount: total * 100, // Convertito in centesimi
      currency: "eur",
      quantity: totalQuantity,
    };
    console.log('Invio richiesta pagamento:', paymentData);
    try {
      const paymentResponse = await initiatePayment(token, paymentData);
      console.log("Risposta ottenuta initiate:",paymentResponse)
      if (paymentResponse.clientSecret) {
        //Setto paymentIntentId
        localStorage.setItem("paymentIntentId", paymentResponse.paymentId);
        //Setto l'ID dell'ordine creato
        localStorage.setItem("orderId", paymentResponse.orderId);
        //Setto l'ID della signature
        localStorage.setItem("signature", paymentResponse.signature);
        // Reindirizza alla pagina di pagamento, passando il clientSecret
        navigate("/payment", { state: { clientSecret: paymentResponse.clientSecret } });
      } else {
        alert("Errore nell'inizializzazione del pagamento.");
      }
    } catch (error) {
      console.error("Errore nella creazione dell'ordine:", error);
      alert("Si è verificato un errore durante il completamento dell'ordine. Riprova!");
    }
  };

  return (
    <div className="checkoutContainer">
      <h2 className="checkoutTitle">
        <FiShoppingBag /> Checkout
      </h2>
      <div className="checkoutCard">
        {cartItems.length > 0 ? (
          <div className="checkoutItems">
            {cartItems.map((item) => (
              <div key={item.uniqueId} className="cardItem">
                <img src={item.image[0]} alt={item.name} className="cardImage" />
                <div className="itemDetails">
                  <span className="itemName">{item.name}</span>
                  <span className="itemPrice">€{item.price}</span>
                  <span className="itemPrice">Q.ty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Il carrello è vuoto. 🛒</p>
        )}

        {/* Subtotale, Spedizione e Totale */}
        <div className="pricingDetails">
          <div className="pricingItem">
            <span className="pricingLabel">Subtotale:</span>
            <span className="pricingValue">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="pricingItem">
            <span className="pricingLabel">Spedizione:</span>
            <span className="pricingValue">€{shippingCost.toFixed(2)}</span>
          </div>
          <div className="pricingItem total">
            <span className="pricingLabel">Totale:</span>
            <span className="pricingValue totalValue">€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkoutFooter">
          <button className="checkoutButton" onClick={handleOrder}>
            Completa l'ordine
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
