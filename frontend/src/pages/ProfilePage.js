import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProfile, getUserOrders } from "../services/api"; // Aggiungi la funzione getOrders
import "../styles/profile.css";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../components/Navbar";
import ShipmentMap from "../components/ShipmentMap";
import Iridescence from "../components/Backgrounds/Iridescence/Iridescence";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    logout,
    user: auth0User,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    // Recupera il carrello dal localStorage al caricamento della pagina
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const defaultImage =
    "data:image/png;base64,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";

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      setCartItems([]); // Svuota il carrello in React
      logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  /*Reperimento ordini */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (user && user._id) {
        const response = await getUserOrders(user._id, token);
        setOrders(response);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  /*Reperimento Info utente */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const idTokenUrl = searchParams.get("idToken"); //Lo prendo da URL e lo setto sul token

      if (token) {
        console.log("SONO ENTRATO DENTRO IL PRIMO IF USE EFFECT TOKEN")
        const response = await getProfile(token);
        setUser(response.user);
      }

      if (idTokenUrl) {
        console.log("SONO ENTRATO DENTRO IL SECONDO IF USE EFFECT TOKEN")
        const token = localStorage.setItem("token", idTokenUrl);
        const response = await getProfile(token);
        setUser(response.user);
      }
    };

    if (isAuthenticated !== undefined) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Background Animato */}
      <Iridescence
        color={[0.3, 0.2, 0.5]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <div className="profile-container">
        <Navbar
          cartItems={cartItems}
          setCartItems={setCartItems}
          setPopupMessage={setPopupMessage}
          setPopupType={setPopupType}
        />

        {/* Popup per il messaggio "Articolo aggiunto o rimosso (navbar.js)" */}
        {popupMessage && (
          <div className={`popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}

        <h2>Dashboard</h2>
        {/* Solo se sono admin posso accedere a questa sezione*/}
        {user ? (
          user.role === "admin" ? (
            <div className="admin-section">
              {/* Dashboard Admin */}
              <h3>Management Panel</h3>
              <button
                className="button-admin"
                onClick={() => navigate("/admin/warehouse")}
              >
                Gestisci Prodotti
              </button>
              <button
                className="button-admin"
                onClick={() => navigate("/admin/orders")}
              >
                Gestisci Ordini
              </button>
              <div>
                <h2>Bentornato amministratore {user.username}</h2>
                <p>Con la tua mail "{user.email}" puoi gestire tante cose</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Dashboard Utente */}
              <h2>Benvenuto {user.username}</h2>
              <p>Con la tua mail "{user.email}" puoi fare tanti acquisti!</p>

              <div className="profile-picture">
                {user.profileImage ? ( 
                  // Log per vedere cosa contiene user.profileImage
                  (console.log("IMMAGINE LOG:",user.profileImage),
                  // Controlliamo se l'immagine è in base64 o URL
                  user.profileImage.startsWith("http") ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="profileImage"
                      onClick={() => navigate("/userInfo")}
                    />
                  ) : (
                    <img
                      src={`data:image/jpeg;base64,${user.profileImage}`}
                      alt="Profile"
                      className="profileImage"
                      onClick={() => navigate("/userInfo")}
                    />
                  ))
                ) : (
                  <img
                    src={defaultImage}
                    alt="Profile Image"
                    className="profileImage"
                    onClick={() => navigate("/userInfo")}
                  />
                )}
              </div>

              <h3>I tuoi ordini</h3>
              {orders.length > 0 ? (
                <>
                  <ul className="order-list">
                    {orders.map((order) => (
                      <li key={order._id} className="order-item">
                        <p>
                          <strong>Ordine ID:</strong> {order.orderId}
                        </p>
                        <p>
                          <strong>Stato:</strong> {order.status}
                        </p>
                        <p>
                          <strong>Totale:</strong> €{order.totalAmount}
                        </p>
                        <p>
                          <strong>Data:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <ul>
                          {order.cartItems.map((item) => (
                            <li key={item.productId}>
                              {item.name} - {item.quantity} x €{item.price}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  {/*Prelevo ultimo ordino e lo mostro nella mappa */}
                  {orders.length > 0 && (
                    <ShipmentMap orderId={orders[orders.length - 1].orderId} />
                  )}
                </>
              ) : (
                <p>Non hai ancora effettuato ordini.</p>
              )}
            </div>
          )
        ) : (
          <p>Caricamento...</p>
        )}

        <button className="logout-btn" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
