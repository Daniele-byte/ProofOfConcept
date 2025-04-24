import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/register.css"; // Importa il CSS per la pagina di registrazione
import Aurora from "../components/Backgrounds/Aurora/Aurora";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      //Debug! esponde dati sensibili
      //console.log('Registering user with:', username, email, password);
      const data = await registerUser(username, email, password);
      console.log("Registration successful:", data);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      // Gestisci errori specifici
      if (err.response && err.response.data && err.response.data.error) {
        // Sostituisco le interruzioni di linea \n con <br />
        let formattedError = err.response.data.error.replace(/\n/g, "<br />");
        // Gestisci spazi multipli (sostituisci spazi consecutivi con non-breaking space)
        formattedError = formattedError.replace(/ {2,}/g, "&nbsp;&nbsp;");

        setError(formattedError); // Mostra l'errore formattato
      } else {
        setError("Errore durante la registrazione");
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Animato */}
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5} />
      <div className="register-container">
        <h2 className="register-h2">Registrazione</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <h6>
            La password deve contenere almeno: <br></br> - una lettera minuscola{" "}
            <br></br> - una lettera maiuscola <br></br> - un numero <br></br> -
            un carattere speciale <br></br> - 8 caratteri
          </h6>
          {error && (
            <p className="error" dangerouslySetInnerHTML={{ __html: error }} />
          )}
          <button type="submit">Registrati</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
