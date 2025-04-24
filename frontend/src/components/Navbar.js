import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiBell, FiUser, FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import "../components-style/navbar.css";

const Navbar = ({ onSearch, searchInput, cartItems, setCartItems, setPopupMessage, setPopupType }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Ottieni l'URL corrente
  //Stato per mostrare il popup del carrello
  const [cartVisible, setCartVisible] = useState(false);
  
  // Recupera il carrello dal localStorage quando la Navbar si monta
  const [localCart, setLocalCart] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    //viene convertito da stringa JSON a array e assegnato a localCart
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Aggiorna il carrello (localCart) locale ogni volta che `cartItems` cambia
  useEffect(() => {
    if (cartItems) {
      setLocalCart(cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Funzione per rimuovere un prodotto specifico dal carrello
  const removeFromCart = (uniqueId) => {
    const updatedCart = localCart.filter((item) => item.uniqueId !== uniqueId);
  
    setLocalCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  
    if (setCartItems) {
      setCartItems(updatedCart);
    }
    // Mostra il popup di rimozione
    setPopupMessage('Articolo rimosso dal carrello!');
    setPopupType('remove'); // Imposta il tipo di popup a "remove" mi serve per il css (in rosso)

    setTimeout(() => {
      setPopupMessage('');
    }, 3000);
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/profile")}>LogisticaPro</div>

        {/* Barra di ricerca visibile solo su /shop */}
        {location.pathname === "/shop" && (
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Cerca prodotti..." 
              value={searchInput}  
              onChange={(e) => onSearch(e.target.value)}  
            />
            <FiSearch className="search-icon" onClick={() => navigate(`/shop?search=${encodeURIComponent(searchInput)}`)} />
          </div>
        )}

        <div className="nav-icons">
          <FiBell className="icon" />
          <FiUser className="icon" onClick={() => navigate("/userInfo")} />
          <FiShoppingCart className="icon" onClick={() => navigate("/shop")} />
          <FiShoppingBag className="icon" onClick={() => setCartVisible(!cartVisible)} />
        </div>
      </nav>

      {/* Popup del carrello */}
      {cartVisible && (
        <div className="cart-popup">
          <h4>Carrello</h4>
          {localCart.length > 0 ? (
            <ul>
              {localCart.map((item) => (
                <li key={item.uniqueId}>
                  <img src={item.image[0]} alt={item.name} className="cart-item-image" />
                  <span>{item.name} - €{item.price} - Q.ta: {item.quantity}</span>
                  <button className="remove-item" onClick={() => removeFromCart(item.uniqueId)}>❌</button>
                </li>
              ))}
              
              <button className="buy-button" onClick={() => navigate("/checkout")}>Vai al checkout</button>
            </ul>
          ) : (
            <p>Il carrello è vuoto</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
