import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from '../services/api';
import Navbar from "../components/Navbar";
import '../styles/productDetails.css';

const ProductDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null); // Assicurati che `product` venga caricato correttamente
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');
    const [cartItems, setCartItems] = useState(() => {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    });
    const [selectedImage, setSelectedImage] = useState(null); // Per gestire l'immagine selezionata
  
    useEffect(() => {
      const fetchProduct = async () => {
        const token = localStorage.getItem('token');
        try {
          const productDetails = await getProductDetails(token, id); // Recupera i dettagli del prodotto
          setProduct(productDetails.product); // Imposta il prodotto nel state
          setSelectedImage(productDetails.product.image[0]); // Imposta la prima immagine come immagine selezionata
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };
  
      fetchProduct();
    }, [id]);
  
    const addToCart = (product) => {
        const quantity = 1; // Imposta la quantità predefinita a 1 per ogni aggiunta
       // console.log('Aggiungendo al carrello:', quantity); // Logga la quantità prima dell'aggiunta
        const existingProductIndex = cartItems.findIndex(item => item._id === product._id);
      
        let updatedCart = [...cartItems]; // Definisci updatedCart fuori dai rami if-else
      
        if (existingProductIndex !== -1) {
          // Se il prodotto è già nel carrello, aggiorna la quantità
        //  console.log('Prodotto esistente, nuova quantità:', cartItems[existingProductIndex].quantity + quantity);
          updatedCart[existingProductIndex].quantity += quantity; // Incrementa la quantità esistente
        } else {
          // Se il prodotto non è nel carrello, aggiungi un nuovo elemento con quantity = 1
          const newCartItem = { ...product, quantity: quantity, uniqueId: Date.now() }; // Assegno un ID univoco
          updatedCart = [...updatedCart, newCartItem]; // Aggiorna l'array del carrello con il nuovo prodotto
        //  console.log('Aggiunto nuovo prodotto, quantità:', newCartItem.quantity); // Logga la quantità del nuovo prodotto
        }
      
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      
        // Mostra il popup di aggiunta
        setPopupMessage('Articolo aggiunto al carrello!');
        setPopupType('add'); // Imposta il tipo di popup a "add" per il CSS
      
        setTimeout(() => {
          setPopupMessage('');
        }, 3000);
      };
  
    // Se il prodotto non è ancora stato caricato
    if (!product) {
      return <h2>Caricamento prodotto...</h2>;
    }
  
    return (
      <div className="product-detail-container">
        <Navbar cartItems={cartItems} setCartItems={setCartItems} setPopupMessage={setPopupMessage} setPopupType={setPopupType} />
  
        {popupMessage && (
          <div className={`popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}
  
        <div className="product-detail">
          <div className="image-gallery">
            {/* Immagine principale */}
            <img src={selectedImage} alt={product.name} className="main-image" />
  
            {/* Galleria di immagini */}
            <div className="thumbnail-container">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  className="thumbnail"
                  onClick={() => setSelectedImage(img)} // Cambia l'immagine principale quando cliccata
                />
              ))}
            </div>
          </div>
  
          <div className="product-info-details">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="product-price-details">€{product.price}</p>
            <p className="product-price-availability">Disponibilità: {product.qty}</p>
            <button className="buy-button-details" onClick={() => addToCart(product)}>
              Aggiungi al carrello
            </button>
            <button className="back-button-details" onClick={() => navigate("/shop")}>
              Torna allo shop
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export default ProductDetails;



