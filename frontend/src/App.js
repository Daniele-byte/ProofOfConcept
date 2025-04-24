// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';  // Aggiungi la pagina Dashboard
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import ProductDetails from './pages/ProductDetails';
import Checkout from "./pages/Checkout"; // Importa la pagina
import WarehouseManagement from "./pages/admin/WarehouseManagement"; // Importa la pagina
import AdminOrders from "./pages/admin/AdminOrders"; // Importiamo la pagina
import UserInfo from './pages/UserInfo';
import OrderDetails from "./pages/admin/OrderDetails"; 
import Payment from "./pages/Payment"
import './styles/login.css'; // Importa il CSS per login
import './styles/profile.css'; // Importa il CSS per dashboard


function App() {
  return (
    <Router>
      <Routes>
        {/* Rotta login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />  
        {/* Rotta default */}
        <Route path="/" element={<LoginPage />} />
        {/* rotta per Dashboard */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/userInfo" element={<UserInfo />} />
        <Route path="/payment" element={<Payment />} />
        {/* Rotte protette per admin */}
        <Route path="/admin/warehouse/" element={<WarehouseManagement />} />
        <Route path="/admin/orders/" element={<AdminOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
