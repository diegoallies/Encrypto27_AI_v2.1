require("dotenv").config();
const mongoose = require("mongoose");


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

// Définition du Schéma pour 'antilien'
const antilienSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  etat: { type: String, default: "non" }, // Valeur par défaut: 'non'
  action: { type: String, default: "supp" }, // Valeur par défaut: 'supp'
});

// Création du Modèle
const Antilien = mongoose.model("Antilien", antilienSchema);

// Fonction pour ajouter ou mettre à jour un JID
const ajouterOuMettreAJourJid = async (jid, etat) => {
  try {
    const updated = await Antilien.findOneAndUpdate(
      { jid },
      { etat },
      { upsert: true, new: true }
    );
    console.log(`✅ JID ${jid} ajouté/mis à jour avec succès dans 'antilien':`, updated);
  } catch (error) {
    console.error("❌ Erreur d'ajout/mise à jour du JID dans 'antilien':", error);
  }
};

// Fonction pour mettre à jour l'action d'un JID
const mettreAJourAction = async (jid, action) => {
  try {
    const updated = await Antilien.findOneAndUpdate(
      { jid },
      { action },
      { upsert: true, new: true }
    );
    console.log(`✅ Action mise à jour pour JID ${jid}:`, updated);
  } catch (error) {
    console.error("❌ Erreur de mise à jour de l'action du JID:", error);
  }
};

// Fonction pour vérifier si un JID a l'état 'oui'
const verifierEtatJid = async (jid) => {
  try {
    const data = await Antilien.findOne({ jid });
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l'état du JID:", error);
    return false;
  }
};

// Fonction pour récupérer l'action associée à un JID
const recupererActionJid = async (jid) => {
  try {
    const data = await Antilien.findOne({ jid });
    return data ? data.action : "supp"; // Valeur par défaut: 'supp'
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'action du JID:", error);
    return "supp";
  }
};

module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
};
