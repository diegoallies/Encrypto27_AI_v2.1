require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB URI
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// Check if already connected
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Not connected, attempt to connect
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Increase connection timeout
      });
      console.log("✅ Connected to MongoDB");
    } else {
      console.log("✅ MongoDB is already connected");
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

// Define the Schema for "onlyAdmin"
const onlyAdminSchema = new mongoose.Schema({
  groupeJid: { type: String, required: true, unique: true },
});

// Create the Model
const OnlyAdmin = mongoose.model("OnlyAdmin", onlyAdminSchema);

// Function to add a group to the "onlyAdmin" list
const addGroupToOnlyAdminList = async (groupeJid) => {
  try {
    const existingGroup = await OnlyAdmin.findOne({ groupeJid });
    if (existingGroup) {
      console.log(`Groupe JID ${groupeJid} déjà présent dans la liste des groupes onlyAdmin.`);
      return;
    }

    const newGroup = new OnlyAdmin({ groupeJid });
    await newGroup.save();
    console.log(`Groupe JID ${groupeJid} ajouté à la liste des groupes onlyAdmin.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du groupe onlyAdmin :", error);
  }
};

// Function to check if a group is in the "onlyAdmin" list
const isGroupOnlyAdmin = async (groupeJid) => {
  try {
    const group = await OnlyAdmin.findOne({ groupeJid });
    return group !== null; // If found, return true; otherwise, false
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du groupe onlyAdmin :", error);
    return false;
  }
};

// Function to remove a group from the "onlyAdmin" list
const removeGroupFromOnlyAdminList = async (groupeJid) => {
  try {
    const result = await OnlyAdmin.deleteOne({ groupeJid });
    if (result.deletedCount > 0) {
      console.log(`Groupe JID ${groupeJid} supprimé de la liste des groupes onlyAdmin.`);
    } else {
      console.log(`Aucun groupe avec JID ${groupeJid} trouvé dans la liste onlyAdmin.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du groupe onlyAdmin :", error);
  }
};

// Example of initialization: check if the "onlyAdmin" collection has any documents
const initializeCollection = async () => {
  try {
    const count = await OnlyAdmin.countDocuments();
    if (count === 0) {
      console.log("La collection 'onlyAdmin' est vide.");
    } else {
      console.log(`La collection 'onlyAdmin' contient ${count} groupes.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la collection onlyAdmin :", error);
  }
};

// Initialize connection and collection check
connectToDatabase();
initializeCollection();

module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};
