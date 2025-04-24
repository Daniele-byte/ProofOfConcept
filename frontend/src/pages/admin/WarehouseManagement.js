import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getProfile, getWarehouseProducts, updateProductQuantity, deleteProductFromWarehouse } from '../../services/api';
import '../../styles/admin/warehouse.css';
import Navbar from '../../components/Navbar';

const WarehouseManagement = () => {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatedProduct, setUpdatedProduct] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');
    const token = localStorage.getItem("token");

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

        const fetchProducts = async () => {
            try {
                if (token) {
                    const products = await getWarehouseProducts(token);
                    setProducts(products);
                }
            } catch (error) {
                console.error('Error fetching warehouse products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
        fetchProducts();
    }, [token]);

    const handleIncreaseQuantity = async (productId) => {
        try {
            const updatedProduct = await updateProductQuantity(token, productId, 1);
            setProducts(products.map(product =>
                product._id === productId ? updatedProduct : product
            ));
            setUpdatedProduct(updatedProduct);
            setIsPopupVisible(true);
        } catch (error) {
            console.error('Error increasing product quantity:', error);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            const updatedProduct = await updateProductQuantity(token, productId, -1);
            setProducts(products.map(product =>
                product._id === productId ? updatedProduct : product
            ));
            setUpdatedProduct(updatedProduct);
            setIsPopupVisible(true);
        } catch (error) {
            console.error('Error decreasing product quantity:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProductFromWarehouse(token, productId);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };


    const closePopup = () => {
        setIsPopupVisible(false);
    };

    if (!user) return <p>Errore: Nessun utente trovato.</p>;
    if (user.role !== 'admin') {
        return <Navigate to="/profile" />;
    }

    return (
        <div>
            <Navbar
                setPopupMessage={setPopupMessage}
                setPopupType={setPopupType}
            />

            {/*Popup*/}
        {popupMessage && (
          <div className={`popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}
            <h1 className="h1-warehouse">Gestione Magazzino</h1>
            {loading ? <p>Caricamento prodotti...</p> : (
                <div className="product-list">
                    <h2 className="h2-warehouse">Prodotti nel Magazzino</h2>
                    <div className="product-cards">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <h3 className="h3-warehouse">{product.name}</h3>
                                <img src={product.image[0]} alt={product.name} />
                                <p><strong>Prezzo:</strong> {product.price}€</p>
                                <p><strong>Quantità:</strong> {product.qty}</p>

                                <div className="quantity-controls">
                                    <button className="Add" onClick={() => handleIncreaseQuantity(product._id)}>+</button>
                                    <input
                                        type="text"
                                        value={product.qty}
                                        disabled
                                    />
                                    <button className="Remove" onClick={() => handleDecreaseQuantity(product._id)}>-</button>
                                </div>

                                <button className="Remove" onClick={() => handleDeleteProduct(product._id)}>Elimina Prodotto</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isPopupVisible && (
                <div className="popup">
                    <p>Quantità del prodotto <strong>{updatedProduct.name}</strong> aggiornata con successo!</p>
                    <button onClick={closePopup}>Chiudi</button>
                </div>
            )}
        </div>
    );
};

export default WarehouseManagement;


