//AdminOrders.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders, updateOrderStatus, getProfile } from "../../services/api"; // Aggiungiamo le API
import "../../styles/admin/adminOrders.css"; // Stileremo la pagina
import Navbar from "../../components/Navbar";

const AdminOrders = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
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
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getAllOrders(token); // API per recuperare tutti gli ordini

        // Verifica la risposta e gestisci correttamente gli ordini
        if (response && Array.isArray(response)) {
          setOrders(response); // Imposta direttamente la risposta come ordini
        } else {
          setOrders([]); // In caso di risposta non valida o errore
        }
      } catch (error) {
        console.error("Errore nel caricamento degli ordini:", error);
        setOrders([]); // Gestione fallback in caso di errore
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);



  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await updateOrderStatus(orderId, newStatus, token);
  
      // 🔹 Aggiorna lo stato direttamente sulla lista degli ordini
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error);
    }
  };
  

  if (loading) return <p>Caricamento ordini...</p>;
  /*Controllo di sicurezza */
  if (user.role !== 'admin') {
    return navigate("/profile") ;
  }
  return (
    <div className="admin-orders-container">
      <Navbar
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
      /> {/* Implementare aggiunta o rimozione elementi del carrello come da tutte le parti.. */}

      {/*Popup*/}
      {popupMessage && (
        <div className={`popup ${popupType}`}>
          <p>{popupMessage}</p>
        </div>
      )}

      <h2 className="h2-gestione">Gestione Ordini</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Ordine</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Stato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td> <br></br>{order.user.username}<br></br> {order.user.email} <br></br><br></br></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  >
                    <option value="creato">Creato</option>
                    <option value="annullato">Annullato</option>
                    <option value="evaso">Evaso</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => navigate(`/orders/${order.orderId}`)}>Dettagli</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      ) : (
        <p>Nessun ordine trovato.</p>
      )}
    </div>
  );
};

export default AdminOrders;


