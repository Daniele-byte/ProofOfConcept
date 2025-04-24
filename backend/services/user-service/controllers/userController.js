const { User } = require("../models/userModel");
const AWS = require("aws-sdk");

// Configura il client S3
const s3 = new AWS.S3({
  region: "us-east-1",
});

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const updateProfile = async (req, res) => {
  try {
    const { id, username, email, imageKey, password } = req.body;
    console.log("Password fornita:", password);
    console.log("ImageKey fornito:", imageKey);

    // Trova l'utente per ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato!" });
    }

    // Aggiorna i campi se forniti
    if (username) user.username = username;
    if (email) user.email = email;
    if (imageKey) {
      user.profileImage = `https://profile-photos-bucket-user-service-10-03-25.s3.amazonaws.com/${imageKey}`;
    }
    if (password && password.trim() !== "") {
      // Se viene fornita una nuova password (non vuota), validala e aggiorna
      if (!password.match(passwordRegex)) {
        return res.status(400).json({
          error:
            "La password deve essere lunga almeno 8 caratteri, includere una lettera maiuscola, un numero e un carattere speciale.",
        });
      }
      // Assegna la password in chiaro; verrà hashata dal middleware pre('save')
      user.password = password;
    }
    // Se la password non è stata fornita, il campo password non viene modificato

    // Salva le modifiche nel database
    await user.save();

    res.status(200).json({
      message: "Profilo aggiornato con successo!",
      user: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo:", error);
    res
      .status(500)
      .json({ error: "Errore durante l'aggiornamento del profilo." });
  }
};

//Upload image on s3 bucket
const uploadS3 = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nessun file inviato" });
    }
    const file = req.file;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const key = `profileImages/${fileName}`;
    
    // Estensioni e MIME types accettati
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    // Estraggo estensione del file
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (
      !allowedExtensions.includes(fileExtension) ||
      !allowedMimeTypes.includes(fileType)
    ) {
      return res.status(400).json({
        error: "Formato file non valido. Sono ammessi solo JPEG, JPG, PNG.",
      });
    }
    
    // Parametri per S3
    const params = {
      Bucket: "profile-photos-bucket-user-service-10-03-25",
      Key: key,
      Body: file.buffer,
      ContentType: fileType,
    };

    // Carica il file su S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(
          "Errore durante l'upload su S3:",
          JSON.stringify(err, null, 2)
        );
        return res.status(500).json({
          error: "Errore durante l'upload su S3",
          details: err.message,
        });
      }

      // Invece di restituire l'URL completo, restituisci solo la chiave
      res.json({ imageKey: key });
    });
  } catch (error) {
    console.error("Errore nell'endpoint /upload:", error);
    return res.status(500).json({ error: "Errore durante l'upload" });
  }
};

module.exports = { updateProfile, uploadS3 };
