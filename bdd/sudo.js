require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define the Schema for "sudo"
const sudoSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true }
});

// Create the Model
const Sudo = mongoose.model("Sudo", sudoSchema);

// Function to add a sudo number
const addSudoNumber = async (jid) => {
  try {
    const existingSudo = await Sudo.findOne({ jid });
    if (existingSudo) {
      console.log(`Le numéro ${jid} est déjà autorisé.`);
      return;
    }

    const newSudo = new Sudo({ jid });
    await newSudo.save();
    console.log(`Numéro ${jid} ajouté à la liste des numéros autorisés.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du numéro de téléphone autorisé :", error);
  }
};

// Function to check if a sudo number exists
const issudo = async (jid) => {
  try {
    const sudo = await Sudo.findOne({ jid });
    return sudo !== null;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du numéro autorisé :", error);
    return false;
  }
};

// Function to remove a sudo number
const removeSudoNumber = async (jid) => {
  try {
    const result = await Sudo.deleteOne({ jid });
    if (result.deletedCount > 0) {
      console.log(`Numéro ${jid} supprimé de la liste des numéros autorisés.`);
    } else {
      console.log(`Numéro ${jid} non trouvé.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du numéro de téléphone autorisé :", error);
  }
};

// Function to get all sudo numbers
const getAllSudoNumbers = async () => {
  try {
    const sudoNumbers = await Sudo.find({});
    return sudoNumbers.map(sudo => sudo.jid);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des numéros autorisés :", error);
    return [];
  }
};

// Function to check if the sudo collection is empty
const isSudoTableNotEmpty = async () => {
  try {
    const count = await Sudo.countDocuments();
    return count > 0;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de la collection 'sudo' :", error);
    return false;
  }
};

// Example: check if the "sudo" collection has any documents
const initializeCollection = async () => {
  const isNotEmpty = await isSudoTableNotEmpty();
  if (isNotEmpty) {
    console.log("La collection 'sudo' contient des numéros.");
  } else {
    console.log("La collection 'sudo' est vide.");
  }
};

// Run the initialization check
initializeCollection();

module.exports = {
  addSudoNumber,
  issudo,
  removeSudoNumber,
  getAllSudoNumbers,
  isSudoTableNotEmpty,
};
