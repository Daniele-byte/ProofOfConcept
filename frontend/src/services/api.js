// src/services/api.js

import axios from "axios";
const api = axios.create({
  baseURL: "https://microservices-alb-216051693.us-east-1.elb.amazonaws.com/api/auth",
});

// Funzione per effettuare la richiesta di login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token); // Salvo il token
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Error logging in:", error.response.data);
    throw error;
  }
};

// Funzione per registrare un nuovo utente
export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  } catch (error) {
    console.error(
      "Error registering:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

//Invia token all'endpoint protetto "/profile" nel campo Authorization
// Funzione per ottenere il profilo dell'utente
export const getProfile = async () => {
  // Recupero il token da localStorage (per login personalizzato) o dal Cookie se l'utente si è loggato attraverso Auth0
  const token = localStorage.getItem("token");
  //console.log("🔹 Token inviato nella richiesta API:", token);
  // Se il token è presente, invia la richiesta con Authorization o usa i cookie se Auth0 è in uso
  try {
    const response = await api.get("/profile", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, // Aggiungi il token nell'header se presente
    });
    console.log("La risposta ottenuta dal BACKEEEEEEND", response);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching profile:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const upload = async (formData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        /* Se necessario, aggiungere anche l'header Authorization
        ...(token && { Authorization: `Bearer ${token}` }),*/
      },
    });
    console.log("La risposta ottenuta dal backend", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Error upload s3 bucket:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Funzione per aggiornare il profilo dell'utente
export const updateProfile = async (id, username, email, image, password) => {
  const token = localStorage.getItem("token");

  console.log("API DATI: ", id, username, email, image, password);

  const formData = new FormData();
  formData.append("id", String(id));
  formData.append("username", username);
  formData.append("email", email);

  if (image) formData.append("imageKey", image);

  // Aggiungi la password solo se è un valore valido (non null o undefined)
  if (password !== null && password !== undefined && password.trim() !== "") {
    formData.append("password", password);
  }

  try {
    const response = await api.put(`/uploadProfile/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Errore nell'aggiornamento del profilo:",
      error.response?.data || error
    );
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Error logging in:", error.response.data);
    throw error;
  }
};

/* Warehouse-Management */
// Funzione per ottenere tutti i prodotti nel magazzino
const apiWarehouse = axios.create({
  baseURL: "https://localhost:3002/admin/warehouse", // URL del backend
});

export const getWarehouseProducts = async (token) => {
  try {
    const response = await apiWarehouse.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`, // Autenticazione tramite token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse products", error);
    throw error;
  }
};

export const updateProductQuantity = async (token, productId, change) => {
  try {
    // Invia una richiesta PATCH per aggiornare la quantità del prodotto
    const response = await apiWarehouse.patch(
      `/product/${productId}/quantity`, // Cambia il percorso in base alla tua API
      { change }, // Invia la quantità da aggiungere o sottrarre
      {
        headers: {
          Authorization: `Bearer ${token}`, // Autenticazione tramite token
        },
      }
    );
    // La risposta contiene i dati del prodotto aggiornato
    return response.data; // Assicurati che la risposta includa i dati del prodotto aggiornato
  } catch (error) {
    console.error("Error updating product quantity", error);
    throw error;
  }
};

export const deleteProductFromWarehouse = async (token, productId) => {
  try {
    // Invia una richiesta DELETE per eliminare il prodotto
    const response = await apiWarehouse.delete(
      `/product/${productId}`, // Cambia il percorso in base alla tua API
      {
        headers: {
          Authorization: `Bearer ${token}`, // Autenticazione tramite token
        },
      }
    );
    return response.data; // La risposta conterrà la conferma dell'eliminazione
  } catch (error) {
    console.error("Error deleting product from warehouse", error);
    throw error;
  }
};

// Funzione per ottenere i dettagli di un singolo prodotto
export const getProductDetails = async (token, productId) => {
  try {
    // Chiamata GET per ottenere i dettagli del prodotto
    const response = await apiWarehouse.get(`/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Autenticazione tramite token
      },
    });
    return response.data; // Restituisce i dettagli del prodotto
  } catch (error) {
    console.error("Error fetching product details", error);
    throw error; // Lancia l'errore per poterlo gestire nel componente
  }
};

/*order-service (Admin Orders..)*/
const apiOrders = axios.create({
  baseURL: "https://microservices-alb-216051693.us-east-1.elb.amazonaws.com/admin/orders", // URL del backend
});
export const createOrder = async (token, orderData) => {
  try {
    // Aggiusta cartItems nel formato corretto
    const adjustedCartItems = orderData.cartItems.map((item) => ({
      productId: item._id, // Usa _id come productId
      name: item.name,
      quantity: item.quantity, 
      price: item.price,
    }));

    // Prepara l'ordine
    const orderPayload = {
      orderId: orderData.orderId,
      userId: orderData.userId,
      cartItems: adjustedCartItems,
      //Sposto validazione lato server
      //subTotal: orderData.subTotal,
      //shippingCost: orderData.shippingCost,
      //totalAmount: orderData.totalAmount,
      status: orderData.status,
      signature: orderData.signature
    };
    const response = await apiOrders.post("/create", orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders ", error);
    throw error;
  }
};

/*Chiamata API a getAll e chiamata a User-Service (composta) per fornire dettagli più sensati sul cliente */
export const getAllOrders = async (token) => {
  try {
    const response = await apiOrders.get("/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let orders = response.data.orders; // Ottieni gli ordini
    console.log("Ordini ricevuti:", orders);

    // Recupera i dati degli utenti per ogni ordine facendo CHIAMATA A USER-SERVICE
    const ordersWithUserDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const userResponse = await api.get(`/data/${order.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            ...order,
            user: userResponse.data, // Aggiungi i dati dell'utentegetProf all'ordine
          };
        } catch (error) {
          console.error(
            `Errore nel recupero dell'utente ${order.userId}:`,
            error
          );
          return { ...order, user: null }; // In caso di errore, user è null
        }
      })
    );

    console.log("Ordini con dettagli utente:", ordersWithUserDetails);
    return ordersWithUserDetails;
  } catch (error) {
    console.error("Errore nel recupero degli ordini:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await apiOrders.patch(
      `/update/${orderId}`,
      { status }, // Qui passiamo i dati nel body della richiesta
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
};

export const getUserOrders = async (userId, token) => {
  try {
    const response = await apiOrders.get(`/my-order/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Con Axios, i dati sono in response.dataupdateOrder
  } catch (error) {
    console.error(
      "Errore nel recupero degli ordini:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const getOrderById = async (orderId, token) => {
  console.log("Invio order: ", orderId);
  try {
    // Fai entrambe le chiamate contemporaneamente
    const orderResponse = await apiOrders.get(`/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Usa `orderResponse.data.userId` per ottenere i dettagli dell'utente
    const userResponse = await api.get(`/data/${orderResponse.data.userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const order = orderResponse.data;
    const user = userResponse.data;

    return {
      ...order,
      user, // Aggiungi i dati dell'utente
    };
  } catch (error) {
    console.error("Errore API getOrderById:", error);
    throw error;
  }
};

/*Payment-service */
const API_URL = "https://localhost:3005/api/payment";

// Funzione per iniziare il pagamento
export const initiatePayment = async (token, data) => {
  try {
    // Invia la richiesta POST al backend per iniziare il pagamento
    const response = await axios.post(`${API_URL}/initiate`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Controlla se la risposta contiene i dati necessari
    if (response.data && response.data.orderId) {
      // console.log("Risposta di pagamento:", response.data);
      return response.data; // Restituisce i dati come { clientSecret, paymentId, orderId , signature}
    } else {
      // In caso di risposta non valida, lancia un errore
      throw new Error("Dati mancanti nella risposta del backend");
    }
  } catch (error) {
    // Gestisce gli errori e li lancia per essere gestiti nel componente
    // console.error("Errore nell'iniziare il pagamento:", error);
    throw new Error(
      error.response?.data?.error ||
        "Errore sconosciuto durante l'iniziazione del pagamento"
    );
  }
};

/*Shipment-service */
const SHIPMENT_SERVICE_URL = "https://microservices-alb-216051693.us-east-1.elb.amazonaws.com/api/shipments";

export const createShipment = async (token, shipmentData) => {
  try {
    const { orderId, userId, destinationAddress, coordinates } = shipmentData; // ✅ Estraggo i dati correttamente
    let location = coordinates;
    console.log("Coordinate ottenute:", coordinates); // Debug

    const response = await axios.post(SHIPMENT_SERVICE_URL, 
      {
        orderId,
        userId,
        destinationAddress,
        currentLocation: {
          type: "Point",
          coordinates: [location.lng, location.lat], // ⚠️ [lng, lat] ordine corretto per GeoJSON
        },
      },
      {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Spedizione creata con successo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Errore durante la creazione della spedizione:", error);
    throw error;
  }
};


export const getShipmentByOrderId = async (orderId) => {
  console.log("URL RICHIESTA API: ", `${SHIPMENT_SERVICE_URL}/byOrder/${orderId}`);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${SHIPMENT_SERVICE_URL}/byOrder/${orderId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {}, // Aggiungi il token nell'header se presente
    }
    );
    return response.data; // { success: true, shipment: {...} }
  } catch (error) {
    console.error("Errore nel recupero della spedizione:", error);
    throw error;
  }
};


export const getGeocode = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.results[0];
    } else {
      throw new Error("Errore nella geocodifica dell'indirizzo.");
    }
  } catch (error) {
    console.error("Errore durante la richiesta a Google Maps API", error);
    throw error;
  }
};

export default api; // Esporta l'istanza di Axios
