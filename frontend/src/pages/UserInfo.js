import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userInfo.css";
import { getProfile, updateProfile, upload } from "../services/api";
import Navbar from "../components/Navbar";
import Iridescence from "../components/Backgrounds/Iridescence/Iridescence";

const UserInfo = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [id, setID] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newImageFile, setNewImageFile] = useState(null); // Nuovo file selezionato
  const [imagePreview, setImagePreview] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const defaultImage =
    "data:image/png;base64,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";
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await getProfile(token);
          if (response && response.user) {
            setID(response.user._id || response.user.id);
            setUser(response.user);
            setUsername(response.user.username);
            setEmail(response.user.email);
            setProfileImage(response.user.profileImage);
          }
        } catch (error) {
          console.error("Errore nel recupero del profilo:", error);
          alert("Errore nel recupero del profilo utente.");
        }
      } else {
        alert("Non sei autenticato!");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  // Solo per aggiornare l'anteprima e salvare il file selezionato, non fa l'upload immediatamente
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validatePassword = () => {
    if (password && !password.match(passwordRegex)) {
      setPopupMessage(
        "La password deve essere lunga almeno 8 caratteri, includere una lettera maiuscola, un numero e un carattere speciale."
      );
      setPopupType("error");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (password && !validatePassword()) return; // Se la password non è valida, interrompi l'aggiornamento

    try {
        let uploadedImageKey = profileImage; // Se non c'è un nuovo file, mantieni l'URL corrente
  
        // Se è stato selezionato un nuovo file, caricalo su S3 tramite il backend
        if (newImageFile) {
          // Crea un FormData e aggiungi il file
          const formData = new FormData();
          formData.append("file", newImageFile);
          
          // Chiamata al backend per l'upload (il backend restituirà la chiave del file su S3,nella risposta troviamo url completo)
          const uploadResponse = await upload(formData);
          uploadedImageKey = uploadResponse.data.imageKey;
        }  // Se la password è vuota o non è cambiata, non inviarla , profileImage è l'url del buckets3
      const updatedUser = await updateProfile(
        id,
        username,
        email,
        uploadedImageKey, //public url
        password.length > 0 ? password : null
      );
      setProfileImage(updatedUser.profileImage);
      setPopupMessage("Profilo aggiornato con successo!");
      setPopupType("success");
      // Imposta un timeout per nascondere il popup dopo 3 secondi
      setTimeout(() => {
        setPopupMessage(""); // Rimuovi il messaggio del popup
        setPopupType(""); // Rimuovi il tipo del popup
      }, 3000); // 3000 ms = 3 secondi
    } catch (error) {
      setPopupMessage("Errore durante l'aggiornamento del profilo.");
      setPopupType("error");
      // Imposta un timeout per nascondere il popup dopo 3 secondi
      setTimeout(() => {
        setPopupMessage(""); // Rimuovi il messaggio del popup
        setPopupType(""); // Rimuovi il tipo del popup
      }, 3000); // 3000 ms = 3 secondi
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
      <Iridescence
        color={[0.3, 0.2, 0.5]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <div>
        <Navbar setPopupMessage={setPopupMessage} setPopupType={setPopupType} />

        {popupMessage && (
          <div className={`popup ${popupType}`}>
            <p>{popupMessage}</p>
          </div>
        )}

        <div className="userInfoWrapper">
          <h2 className="userInfoTitle">Profilo Utente</h2>
          <div className="profileCard">
            <div className="profileImageSection">
              <div className="profileImageWrapper">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="profileImage"
                  />
                ) : profileImage ? (
                  profileImage.startsWith("http") ? (
                    <img
                      src={profileImage}
                      alt="OAuth Profile"
                      className="profileImage"
                    />
                  ) : (
                    <img
                      src={`data:image/jpeg;base64,${profileImage}`}
                      alt="Profile"
                      className="profileImage"
                    />
                  )
                ) : (
                  <img
                    src={defaultImage}
                    alt="Profile Image"
                    className="profileImage"
                    onClick={() => navigate("/userInfo")}
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="imageInput"
              />
            </div>

            {user && (
              <div className="formInputs">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="inputField"
                  placeholder="Nuovo Username"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputField"
                  placeholder="Nuova Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputField"
                  placeholder="Nuova Password"
                />
                <button onClick={handleUpdate} className="updateButton">
                  Aggiorna Profilo
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="backToHomeButton"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
