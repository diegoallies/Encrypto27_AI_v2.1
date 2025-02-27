// Importez dotenv et chargez les variables d'environnement depuis le fichier .env
require("dotenv").config();

// Importation de mongoose pour se connecter à MongoDB
const mongoose = require("mongoose");

// Utilisez le module 'set' pour obtenir la valeur de MONGODB_URI depuis vos configurations
const s = require("../set");

// Récupérez l'URL de la base de données de la variable s.MONGODB_URI
const dbUrl = s.MONGODB_URI ? s.MONGODB_URI : "mongodb://localhost:27017/mydatabase";

const mongoose = require('mongoose');

// MongoDB URI
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// Check if already connected
if (mongoose.connection.readyState === 0) {
  // Not connected, attempt to connect
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
  console.log("✅ MongoDB is already connected");
}

// Schéma de la collection events
const eventSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  welcome: { type: String, default: 'non' },
  goodbye: { type: String, default: 'non' },
  antipromote: { type: String, default: 'non' },
  antidemote: { type: String, default: 'non' },
});

// Modèle pour la collection events
const Event = mongoose.model("events", eventSchema);

// Fonction pour attribuer une valeur à une colonne spécifiée
async function attribuerUnevaleur(jid, row, valeur) {
  try {
    // Recherche de l'événement par JID
    let event = await Event.findOne({ jid });

    if (event) {
      // Si l'événement existe, mettez à jour la colonne spécifiée
      event[row] = valeur;
      await event.save();
      console.log(`La colonne ${row} a été actualisée sur ${valeur} pour le jid ${jid}`);
    } else {
      // Si l'événement n'existe pas, créez un nouveau document
      const newEvent = new Event({ jid, [row]: valeur });
      await newEvent.save();
      console.log(`Nouveau jid ${jid} ajouté avec la colonne ${row} ayant la valeur ${valeur}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'actualisation de events :", error);
  }
}

// Fonction pour récupérer la valeur d'une colonne spécifiée
async function recupevents(jid, row) {
  try {
    const event = await Event.findOne({ jid });

    if (event) {
      return event[row];
    } else {
      return 'non'; // Retourne la valeur par défaut si l'événement n'existe pas
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement :", error);
  }
}

module.exports = {
  attribuerUnevaleur,
  recupevents,
};
