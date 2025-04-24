import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/shop.css";
import { useEffect } from "react";
import { getWarehouseProducts } from "../services/api"; // Importa la funzione per ottenere i prodotti

import Navbar from "../components/Navbar";

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [cartItems, setCartItems] = useState(() => {
    // Recupera il carrello dal localStorage al caricamento della pagina
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "add" or "remove" for styling purposes
  const [products, setProducts] = useState([]); // Stato per i prodotti

  // Salva il carrello ogni volta che cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Effettua la richiesta per caricare i prodotti
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Recupera il token da localStorage
        const fetchedProducts = await getWarehouseProducts(token); // Fai la chiamata API
        setProducts(fetchedProducts); // Aggiorna lo stato con i prodotti ricevuti
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Chiama la funzione per recuperare i prodotti
  }, []); // Esegui una sola volta al caricamento del componente

  const filteredProducts = products.filter((product) => {
    //filter() è un metodo sugli array che crea un nuovo array contenente solo gli elementi per i quali la condizione passata al filtro restituisce true.
    const searchTermLower = searchTerm.toLowerCase(); //case insensitive trasforma tutto in minuscolo
    // Controlla se il termine di ricerca è presente nel nome del prodotto
    return product.name.toLowerCase().includes(searchTermLower); //controlla se la ricerca contiene il valore
  });

  // Funzione per gestire la ricerca
  const handleSearch = (value) => {
    setSearchInput(value);
    navigate(`/shop?search=${encodeURIComponent(value)}`);
  };

  // Funzione per aggiungere un prodotto al carrello
  const addToCart = (product) => {
    const quantity = 1; // Imposta la quantità predefinita a 1 per ogni aggiunta
    // console.log('Aggiungendo al carrello:', quantity); // Logga la quantità prima dell'aggiunta
    const existingProductIndex = cartItems.findIndex(
      (item) => item._id === product._id
    );

    let updatedCart = [...cartItems]; // Definisci updatedCart fuori dai rami if-else

    if (existingProductIndex !== -1) {
      // Se il prodotto è già nel carrello, aggiorna la quantità
      //  console.log('Prodotto esistente, nuova quantità:', cartItems[existingProductIndex].quantity + quantity);
      updatedCart[existingProductIndex].quantity += quantity; // Incrementa la quantità esistente
    } else {
      // Se il prodotto non è nel carrello, aggiungi un nuovo elemento con quantity = 1
      const newCartItem = {
        ...product,
        quantity: quantity,
        uniqueId: Date.now(),
      }; // Assegno un ID univoco
      updatedCart = [...updatedCart, newCartItem]; // Aggiorna l'array del carrello con il nuovo prodotto
      //  console.log('Aggiunto nuovo prodotto, quantità:', newCartItem.quantity); // Logga la quantità del nuovo prodotto
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Mostra il popup di aggiunta
    setPopupMessage("Articolo aggiunto al carrello!");
    setPopupType("add"); // Imposta il tipo di popup a "add" per il CSS

    setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  // Funzione per navigare al dettaglio del prodotto con validazione dell'ID
  const goToProductDetails = (productId) => {
    if (!productId) {
      alert("ID prodotto non valido.");
      return;
    }
    navigate(`/product/${productId}`);
  };

  return (
      <div className="shop-container">
        <Navbar
          onSearch={handleSearch}
          searchInput={searchInput}
          cartItems={cartItems}
          setCartItems={setCartItems}
          setPopupMessage={setPopupMessage}
          setPopupType={setPopupType}
        />

        <h2 className="shop-title">🛒 Shop</h2>

        {/* Popup per il messaggio "Articolo aggiunto o rimosso (navbar.js)" */}
        {popupMessage && (
          <div className={`popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}

        {/* Griglia prodotti */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="product-image"
                  onClick={() => goToProductDetails(product._id)} // Usa il metodo di navigazione sicuro
                  style={{ cursor: "pointer" }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/200")
                  }
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">€{product.price}</p>
                <p className="product-availability">Q.ta: {product.qty}</p>
                <button
                  className="buy-button-shop"
                  onClick={() => addToCart(product)}
                >
                  Compra
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">Nessun prodotto trovato</p>
          )}
        </div>
      </div>
  );
};

export default ShopPage;
