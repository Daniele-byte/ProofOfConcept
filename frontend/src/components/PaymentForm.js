import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  createOrder,
  updateProductQuantity,
  createShipment,
  getGeocode,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components-style/paymentForm.css"; // Importa il file CSS
const HEADQUARTERS_ADDRESS = "Via Festa del Perdono 7, 20122 Milano, Italia";

const PaymentForm = () => {
  const stripe = useStripe(); //istanza per elaborare i pagamenti
  const elements = useElements(); // l'oggetto che gestisce i componenti UI di pagamento.
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addressInput, setAddressInput] = useState("");
  const [geoData, setGeoData] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState(""); // Stato per il messaggio
  const [verifyingAddress, setVerifyingAddress] = useState(false); // Stato per indicare che la verifica è in corso

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const fetchGeocodeData = async () => {
    setVerifyingAddress(true);
    setVerificationMessage(""); // Resetta eventuali messaggi precedenti
    try {
      const result = await getGeocode(addressInput);
      setGeoData(result);
      setVerificationMessage(
        `Indirizzo confermato: ${result.formatted_address}`
      );
    } catch (error) {
      setGeoData(null);
      setVerificationMessage("Errore: indirizzo non trovato o non valido.");
    } finally {
      setVerifyingAddress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //previene il refresh della pagina, non permetterebbe la gestione asincrona del pagamento
    setLoading(true);

    if (!stripe || !elements) {
      //se non sono inizializzati come sopra Stripe non è pronto per elaborare il pagamento.
      setLoading(false);
      return;
    }

    if (!geoData) {
      alert("Devi confermare un indirizzo valido prima di procedere.");
      setLoading(false);
      return;
    }

    //funzione asincrona
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        shipping: {
          name: geoData.formatted_address,
          address: {
            // Usa il formatted_address come linea principale dell'indirizzo
            line1: geoData.formatted_address,
            // Se lo desideri, puoi estrarre ed aggiungere ulteriori dettagli come city, postal_code, country, ecc.
          },
        },
      }, //Indica a Stripe dove reindirizzare l'utente in caso di necessità.
      redirect: "if_required", //dice a Stripe di non reindirizzare l'utente se il pagamento può essere gestito senza refresh della pagina.
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      //Se il pagamento è riuscito
      try {
        // Recupera i dati dell'ordine da localStorage
        const orderData = JSON.parse(localStorage.getItem("orderData"));
        const token = localStorage.getItem("token");
        const orderId = localStorage.getItem("orderId");
        //Add to mitigation
        const signature = localStorage.getItem("signature");
        if (!orderData) {
          alert("Errore: i dati dell'ordine non sono stati trovati.");
          return;
        }
        console.log("orderDATAAAA: ", orderData);
        //console.log( "paymentInteeeent: ", paymentIntent)

        // Aggiungi l'ID del pagamento al paymentData
        const paymentData = {
          orderId: orderId,
          userId: orderData.userId,
          cartItems: cartItems,
        // Sposto la validazione lato backend
        //  subTotal: orderData.subTotal,
        //  shippingCost: orderData.shippingCost,
          paymentIntentId: paymentIntent.id, // Stripe PaymentIntent ID
          status: "pagato",
        //  totalAmount: orderData.totalAmount,
          currency: orderData.currency || "eur",
          signature: signature
        };
         console.log("I dati che sto per passare alla create ORDER: ", paymentData); //Fino a qui passa tutto correttamente

        // Crea l'ordine nel backend, includendo l'orderId
        const response = await createOrder(token, paymentData);

        //Se l'ordine è stato creato, aggiorna il magazzino
        if (response && response.order) {
          const orderId = response.order._id;
          console.log("Order ID creato:", orderId);

          // Ora puoi fare altre operazioni, come ridurre la quantità dei prodotti nel magazzino
          for (let item of cartItems) {
            const productId = item._id;
            const quantityToReduce = item.quantity;
            await updateProductQuantity(token, productId, -quantityToReduce);
          }

          // Recupera l'indirizzo di spedizione
          //const shippingAddress = orderData.shippingAddress; // ad esempio

          // Crea la spedizione
          const ORD = localStorage.getItem("orderId");
          console.log("Log userId :" , orderData.userId);
          //Altrimenti orderId è _id
          await createShipment(token, {
            orderId: ORD,
            userId: orderData.userId,
            destinationAddress: geoData.formatted_address,
            coordinates: geoData.geometry.location, /*Destinazione */
            headquartersAddress: HEADQUARTERS_ADDRESS, // indirizzo fisso della sede centrale
          });

          // Pulisci localStorage
          localStorage.removeItem("orderData");
          localStorage.removeItem("paymentIntentId");
          localStorage.removeItem("cartItems");
          localStorage.removeItem("orderId");

          // Reindirizza l'utente alla pagina del profilo (o dashboard)
          navigate("/profile");
        } else {
          alert("Errore nella creazione dell'ordine.");
        }
      } catch (error) {
        console.error("Errore durante il processo di pagamento:", error);
        alert(
          "Si è verificato un errore durante il completamento dell'ordine. Riprova."
        );
      }
    }
    setLoading(false);
  };

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2>Completa il Pagamento</h2>
        <PaymentElement className="payment-element" />
        <div className="shipping-address">
          <h3>Indirizzo di Residenza</h3>
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Inserisci il tuo indirizzo"
          />
          <button type="button" onClick={fetchGeocodeData} disabled={verifyingAddress}>
            {verifyingAddress ? "Verifica in corso..." : "Conferma Indirizzo"}
          </button>
          {verificationMessage && <p className="addressVerification">{verificationMessage}</p>}
        </div>
        <button disabled={!stripe || loading} type="submit" className="payment-form-button">
          {loading ? "Elaborazione..." : "Paga"}
        </button>
      </form>
    </div>
  );
};
export default PaymentForm;
