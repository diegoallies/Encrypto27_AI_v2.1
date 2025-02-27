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

// Schéma de la collection warn_users
const warnUserSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  warn_count: { type: Number, default: 0 }
});

// Modèle pour la collection warn_users
const WarnUser = mongoose.model("warn_users", warnUserSchema);

// Fonction pour créer un utilisateur avec un count de warning
async function ajouterUtilisateurAvecWarnCount(jid) {
  try {
    // Recherche de l'utilisateur existant
    let user = await WarnUser.findOne({ jid });
    if (user) {
      // Si l'utilisateur existe, mettre à jour le warn_count
      user.warn_count += 1;
      await user.save();
      console.log(`Utilisateur ${jid} mis à jour avec un warn_count de ${user.warn_count}.`);
    } else {
      // Si l'utilisateur n'existe pas, en créer un nouveau
      user = new WarnUser({ jid, warn_count: 1 });
      await user.save();
      console.log(`Utilisateur ${jid} ajouté avec un warn_count de 1.`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout ou de la mise à jour de l'utilisateur :", error);
  }
}

// Fonction pour récupérer le warn_count par JID
async function getWarnCountByJID(jid) {
  try {
    const user = await WarnUser.findOne({ jid });
    if (user) {
      return user.warn_count;
    } else {
      return 0; // Retourne 0 si l'utilisateur n'existe pas
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du warn_count :", error);
    return -1; // Retourne une valeur d'erreur ou une autre valeur par défaut en cas d'erreur
  }
}

// Fonction pour réinitialiser le warn_count à 0 pour un utilisateur spécifique
async function resetWarnCountByJID(jid) {
  try {
    const user = await WarnUser.findOne({ jid });
    if (user) {
      user.warn_count = 0;
      await user.save();
      console.log(`Le warn_count de l'utilisateur ${jid} a été réinitialisé à 0.`);
    } else {
      console.log(`Utilisateur ${jid} non trouvé.`);
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du warn_count :", error);
  }
}

module.exports = {
  ajouterUtilisateurAvecWarnCount,
  getWarnCountByJID,
  resetWarnCountByJID,
};
