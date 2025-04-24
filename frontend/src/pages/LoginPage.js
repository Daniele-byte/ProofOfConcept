import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser,healthCheck } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react"; // Importa il hook di Auth0
import "../styles/login.css"; // Importa il CSS per la pagina di login
import Aurora from "../components/Backgrounds/Aurora/Aurora";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, logout, isLoading } = useAuth0(); // OpenID Connect
  const authorizationUrl = `https://dev-tgm42mqm1ksnpbqx.us.auth0.com/authorize?response_type=code&client_id=7Vklx9pkZHqEqSEa9DdRi3VKfq2BsVfN&redirect_uri=https://microservices-alb-216051693.us-east-1.elb.amazonaws.com/api/auth/profile&scope=openid%20profile%20email&state=random_state`;

  // Funzione per aprire l'authorization URL
  const handleOpenIDLogin = () => {
    window.location.href = authorizationUrl;
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/profile");
    }
  }, [searchParams, navigate]);

  // Se l'utente è già autenticato, reindirizza alla pagina del profilo
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log("🔹 Token ricevuto:", data.token); // Debug: controlla il token ricevuto
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError("Token non ricevuto dal server");
      }
    } catch (err) {
      setError("Credenziali errate");
    }
  };

  
  const handleHealthCheck = async () => {
    try {
      const data = await healthCheck();
      console.log("🔹 Health test:", data);
    } catch (err) {
      console.log("errore: ",err);
    }
  };


  if (isLoading) {
    return <div>Loading...</div>; // Mostra un loading mentre Auth0 sta verificando l'autenticazione
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Background Animato */}
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5} />
      <div className="login-container">
        <h2 className="login-h2">Login</h2>

        {!isAuthenticated ? (
          <>
            <form onSubmit={handleLogin}>
              <div className="input-div">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-div">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              {/* azienda (B2B scenario) */}
              <button type="submit">Login ✅ </button>
            </form>

            {/* Pulsante per login con Google tramite OpenID Connect */}
            <button onClick={handleOpenIDLogin}>
              Login con OpenID connect ✅
            </button>
            <br></br>
            <button onClick={() => navigate("/register")}>Sign up ✅ </button>
            <br></br>
            <button onClick={() => navigate("/forgot-password")}>
              Forgot password? ❌
            </button>
            <button onClick={handleHealthCheck}>
              Test health Cloud ✅
            </button>
            
          </>
        ) : (
          <div>
            <h3>Benvenuto, {user.name}!</h3>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
