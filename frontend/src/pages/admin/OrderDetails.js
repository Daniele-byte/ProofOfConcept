import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, getProfile } from "../../services/api"; // Funzione API
import "../../styles/admin/orderDetails.css";
import Navbar from "../../components/Navbar";

const OrderDetails = () => {
  const [user, setUser] = useState(null);
  const { orderId } = useParams(); // Prendi l'ID ordine dalla URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  /*Per controllare eventuali accessi impropri controllo il ruolo poi nell'if prima del return.. */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (token) {
          const response = await getProfile(token);
          setUser(response.user);
        }
      } catch (error) {
        console.error('Error fetching admin token:', error);
      }
    };
    fetchUserProfile();
  }, [token]);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId, token);
        setOrder(response);
      } catch (error) {
        console.error("Errore nel recuperare i dettagli dell'ordine:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  
  /*Controllo di sicurezza: importante metterlo prima dei seguenti if perchè con un attacco bruteforce potrei trovare eventuali ordini "non trovati" ma se  lo trovo e mi reindirizza posso inferire qualcosa.. */
  if (!user || user.role !== 'admin') {
    navigate("/profile");
    return null; // Importante per evitare che il resto del codice venga eseguito
  }

  if (loading) return <p>Caricamento dettagli ordine...</p>;
  if (!order) return <p>Ordine non trovato.</p>;
  
  return (
    <>
      <Navbar />
      <div className="order-details-container">
        <h2>Dettagli Ordine</h2>
        <p>
          <strong>ID Ordine:</strong> {order.orderId}
        </p>
        <p>
          <strong>Cliente:</strong> {order.user.username} ({order.user.email})
        </p>
        <p>
          <strong>Data Creazione:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Stato:</strong> {order.status}
        </p>
        <h3 className="h3-details">Prodotti:</h3>
        <ul>
          {order.cartItems && order.cartItems.length > 0 ? (
            order.cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x €{item.price}
              </li>
            ))
          ) : (
            <li>Nessun prodotto presente.</li>
          )}
        </ul>
        <p>
          <strong>Totale:</strong> €{order.totalAmount}
        </p>
        <button onClick={() => navigate(-1)}>Torna Indietro</button>
      </div>
    </>
  );
};

export default OrderDetails;
