const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const axios = require("axios");
const AWS = require("aws-sdk");
// Configura il client S3
const s3 = new AWS.S3({
  region: "us-east-1",
});


const axiosInstance = axios.create({
  baseURL: "https://dev-tgm42mqm1ksnpbqx.us.auth0.com",
  timeout: 5000,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  family: 4, // Forza l'uso di IPv4
});

const uploadProfileImageToS3 = async (imageUrl, userId) => {
  // Se l'immagine non proviene da Google, assumiamo che sia già caricata sul bucket.. (si potrebbe migliorare)
  if (!imageUrl.includes("lh3.googleusercontent.com")) {
    return imageUrl;
  }

  try {
    // Scarica l'immagine da Google
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = imageResponse.data;
    const imageMimeType = imageResponse.headers["content-type"];
    // Estrai l'estensione dal mime type (ad es. "image/jpeg" -> "jpeg")
    const extension = imageMimeType.split("/")[1] || "png";
    // Genera una chiave deterministica basata sull'ID utente
    const s3Key = `profileImages/${userId}.${extension}`;
    const s3Params = {
      Bucket: "profile-photos-bucket-user-service-10-03-25", // es. "profile-photos-bucket-user-service-10-03-25"
      Key: s3Key,
      Body: imageBuffer,
      ContentType: imageMimeType,
    };

    const s3Data = await s3.upload(s3Params).promise();
    console.log("✅ Immagine caricata su S3:", s3Data.Location);
    return s3Data.Location;
  } catch (error) {
    console.error("❌ Errore durante l'upload dell'immagine su S3:", error);
    // In caso di errore, restituisci l'URL originale come fallback
    return imageUrl;
  }
};

const verifyAccessToken = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  let token;

  // **Caso 1: Token JWT classico**
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Sono nel primo caso:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token JWT classico verificato:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Utente non trovato" });
      }

      res.json({ user });
      return next();
    } catch (jwtError) {
      //Devo verificare i dati qui perchè non è il jwt classico ma è Auth0
      console.log("🍪 Token già splittato: ", token);
      try {
        // Decodifica il token (senza verificare la firma)
        const decodedToken = jwt.decode(token);
        console.log("🆔 Dati estratti dal token:", decodedToken);

        // Verifica se il token contiene i dati che ti aspetti
        if (decodedToken) {
          // **Qui cerchiamo l'utente in MongoDB**
          const existingUser = await User.findOne({
            oauthId: decodedToken.sub,
          });

          if (!existingUser) {
            return res
              .status(404)
              .json({ message: "Utente non trovato nel database" });
          }

          // Restituiamo l'ID MongoDB e non quello di Google/Auth0
          const user = {
            id: existingUser.id, // ✅ ID di MongoDB corretto!
            username: existingUser.username,
            email: existingUser.email,
            profileImage: existingUser.profileImage,
          };

          res.json({ user });
        } else {
          throw new Error("Token non valido o danneggiato");
        }
      } catch (error) {
        console.error("❌ Errore nella decodifica del token:", error);
        res.status(400).json({ error: "Token non valido" });
      }
      return next();
    }
  }

  // **Caso 2: OpenID Connect (Authorization Code Flow)**
  const code = req.query.code;
  console.log("🔑 Parametro 'code' dalla query string:", code);

  if (code) {
    const tokenRequestData = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.OIDC_REDIRECT_URI,
    });

    try {
      const response = await axiosInstance.post(
        `${process.env.OIDC_ISSUER}/oauth/token`,
        tokenRequestData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log("✅ Risposta dal server del token:", response.data);

      req.accessToken = response.data.access_token;
      req.refreshToken = response.data.refresh_token;
      req.idToken = response.data.id_token;
      req.tokenType = response.data.token_type;

      // **Decodifica id_token per estrarre le informazioni dell'utente**
      const decodedIdToken = jwt.decode(req.idToken);
      console.log("🆔 Decoded ID Token:", decodedIdToken);

      if (!decodedIdToken) {
        return res
          .status(401)
          .json({ message: "Errore nella decodifica dell'ID Token" });
      }

      // 🔹 **Creiamo un oggetto `req.user` con i dati decodificati**
      req.user = {
        id: decodedIdToken.sub, // L'ID univoco dell'utente su Auth0/Google
        email: decodedIdToken.email,
        name: decodedIdToken.nickname,
        profileImage: decodedIdToken.picture,
      };

      try {
        // **Verifichiamo se l'utente esiste già in MongoDB**
        let existingUser = await User.findOne({ oauthId: req.user.id });

        if (!existingUser) {
          console.log(
            "🆕 L'utente non esiste nel database. Creazione in corso..."
          );

          if (!req.user.id) {
            return res.status(400).json({ message: "ID utente mancante" });
          }

          // Carica l'immagine di Google su S3 Bucket
          const uploadedImageUrl = await uploadProfileImageToS3(req.user.profileImage,req.user.id);
          
          const newUser = new User({
            oauthId: req.user.id, // Salviamo l'ID OAuth per ritrovarlo in futuro
            email: req.user.email,
            name: req.user.name,
            profileImage: uploadedImageUrl,
            username:
              req.user.nickname || req.user.name || `user_${Date.now()}`,
            createdAt: new Date(),
          });

          try {
            await newUser.save();
            console.log("✅ Nuovo utente creato:", newUser);
            existingUser = newUser; // Assegniamo il nuovo utente alla variabile
          } catch (error) {
            console.error(
              "❌ Errore durante il salvataggio dell'utente:",
              error
            );
            return res.status(500).json({
              message: "Errore durante il salvataggio dell'utente",
              error: error.message,
            });
          }
        } else {
          // **Aggiorniamo i dati se l'utente esiste già**
          existingUser.email = req.user.email;
          existingUser.name = req.user.name;
          //existingUser.profileImage = req.user.profileImage;
          await existingUser.save();
          console.log("✅ Utente aggiornato:", existingUser);
        }

        // **Restituiamo l'ID di MongoDB invece dell'ID di Google/Auth0**

        return next();
      } catch (error) {
        console.error(
          "Errore durante la creazione o ricerca dell'utente:",
          error
        );
        return res.status(500).json({
          message: "Errore nel recupero dell'utente",
          error: error.message,
        });
      }
    } catch (error) {
      console.error("❌ Errore durante la richiesta di token:", error);
      return res.status(500).json({
        message: "Errore durante lo scambio del code",
        error: error.message,
      });
    }
  }

  console.log("❌ Nessun token valido trovato");
  return res
    .status(401)
    .json({ message: "Non autorizzato, nessun token valido" });
};

module.exports = { verifyAccessToken };
