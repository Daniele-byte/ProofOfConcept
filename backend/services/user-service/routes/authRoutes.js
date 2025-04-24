const express = require("express");
const {
  registerUser,
  loginUser,
  exchangeCodeForToken,
} = require("../controllers/authController"); // Importa i metodi del controller
const axios = require("axios");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { User, passwordRegex } = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware"); // Middleware di protezione per l'autenticazione
const { updateProfile,uploadS3 } = require("../controllers/userController"); // Controller per l'aggiornamento
const { fetchOrder } = require("../controllers/adminController"); // Controller per l'aggiornamento
const { verifyAccessToken } = require("../middleware/authMiddleware"); //Middleware per rotte sicure
const multer = require("multer");

// Verifica le credenziali caricate (solo per debugging in ambiente di test)
/*AWS.config.getCredentials((err, creds) => {
  if (err) {
    console.error("Errore ottenendo le credenziali AWS:", err);
  } else {
    console.log("Credenziali AWS caricate:", {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: "*****",  // non loggare la secret key in chiaro
      sessionToken: creds.sessionToken ? "Presente" : "Assente"
    });
  }
});*/
// Utilizza la storage in memoria; per file di grandi dimensioni, puoi configurare un disco storage
const upload = multer({ storage: multer.memoryStorage() });

// Assicurati che il cookie-parser sia utilizzato
router.use(cookieParser());

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API per la gestione dell'autenticazione
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *       400:
 *         description: Utente già registrato
 *       500:
 *         description: Errore del server
 */
router.post("/register", registerUser); // Rotta per la registrazione

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il login dell'utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore del server
 */
router.post("/login", loginUser); // Rotta per il login

// Endpoint protetto utilizzo jwt classico middlware protect
// utilizzo invece middlware verifyAccessToken per openID connect

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/profile:
 *   get:
 *     summary: Verifica l'access token e reindirizza al profilo utente
 *     description: >
 *       Questo endpoint verifica il token JWT (inviare nell'header Authorization come "Bearer <token>") oppure il parametro `code` in query per l’OpenID Connect.
 *       Se la verifica va a buon fine, l'utente viene reindirizzato al frontend con i dati utente passati come query string.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         description: Codice di autorizzazione per OpenID Connect.
 *         required: false
 *         schema:
 *           type: string
 *           example: "authorization_code_sample"
 *     responses:
 *       302:
 *         description: Redirezione al frontend con i dati del profilo utente.
 *         headers:
 *           Location:
 *             description: URL di reindirizzamento al frontend.
 *             schema:
 *               type: string
 *         content: {}
 *       400:
 *         description: Errore nella decodifica del token o richiesta non valida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token non valido"
 *       401:
 *         description: Non autorizzato (nessun token valido o utente non trovato).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Non autorizzato, nessun token valido"
 *       500:
 *         description: Errore interno del server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore interno del server"
 */

//Quando accedo e reperisco i dati del profilo genero un Presigned URL per il file S3 e lo invia nella query string del redirect al frontend.
router.get("/profile", verifyAccessToken, async (req, res) => {
  console.log("Token in authRoutes accessToken: ", req.accessToken, "ID token in authRoutess:", req.idToken );

  if (req.idToken) { //Se è stato fatto login con OAUTH
    //Cerco tramithe oauthID
    const user = await User.findOne({ oauthId: req.user.id }); // Recupera l'utente tramite oauthId
    console.log("DB LOG:", req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Se l'utente ha un'immagine, costruiamo l'URL pubblico direttamente
    let publicUrl = null;
    if (user.profileImage) {
      publicUrl = `https://profile-photos-bucket-user-service-10-03-25.s3.amazonaws.com/profileImages/${user.profileImage}`;
    }

    const frontendURL = `https://localhost/profile?email=${encodeURIComponent(
      req.user.email
    )}&idToken=${encodeURIComponent(
      req.idToken
    )}&profileImage=${encodeURIComponent(publicUrl)}`;

    console.log(`🔄 Reindirizzamento a: ${frontendURL}`);
    return res.redirect(frontendURL);
  }
});

/**
 * @swagger
 * /api/auth/data/{userId}:
 *   get:
 *     summary: Preleva i dettagli dell'utente per l'admin
 *     description: L'admin utilizza questa rotta per recuperare i dati di un utente (username ed email) in base all'ID utente fornito.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID dell'utente da cercare.
 *     responses:
 *       200:
 *         description: Utente trovato con successo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "nomeUtente"
 *                 email:
 *                   type: string
 *                   example: "utente@example.com"
 *       404:
 *         description: Utente non trovato.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utente non trovato"
 *       500:
 *         description: Errore nel recupero dell'utente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Errore nel recupero dell'utente"
 *                 error:
 *                   type: object
 */

/*L'admin si serve di questa rotta per prelevare gli ordini effettuando una query*/
router.get("/data/:userId", fetchOrder)

// Endpoint POST per l'upload dell'immagine su S3 bucket
router.post("/upload", upload.single("file"), uploadS3)

/**
 * @swagger
 * /api/auth/uploadProfile/{id}:
 *   put:
 *     summary: Aggiorna il profilo utente
 *     description: Aggiorna le informazioni del profilo utente, inclusi username, email, immagine profilo e password.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID dell'utente il cui profilo deve essere aggiornato.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nuovoUsername"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nuovo.email@example.com"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Immagine profilo in formato Base64 o file multimediale.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: La nuova password deve essere lunga almeno 8 caratteri e contenere una lettera maiuscola, un numero e un carattere speciale.
 *     responses:
 *       200:
 *         description: Profilo aggiornato con successo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profilo aggiornato con successo!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "nuovoUsername"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "nuovo.email@example.com"
 *                     profileImage:
 *                       type: string
 *                       example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *                     _id:
 *                       type: string
 *
 */

// Rotta per aggiornare il profilo (compresa l'immagine del bucket S3 se presente)
router.put("/uploadProfile/:id", updateProfile);

// Endpoint per il controllo della salute del servizio
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = router;
