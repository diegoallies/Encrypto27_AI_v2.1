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

// Define the Schema for "stickcmd"
const stickCmdSchema = new mongoose.Schema({
  cmd: { type: String, required: true, unique: true },
  id: { type: String, required: true }
});

// Create the Model
const StickCmd = mongoose.model("StickCmd", stickCmdSchema);

// Function to add a stick command
const addStickCmd = async (cmd, id) => {
  try {
    const existingCmd = await StickCmd.findOne({ cmd });
    if (existingCmd) {
      console.log(`La commande ${cmd} existe déjà.`);
      return;
    }

    const newCmd = new StickCmd({ cmd, id });
    await newCmd.save();
    console.log(`Commande ${cmd} ajoutée avec succès.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du stickcmd :", error);
  }
};

// Function to check if a stick command exists by ID
const inStickCmd = async (id) => {
  try {
    const cmd = await StickCmd.findOne({ id });
    return cmd !== null;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du stickcmd :", error);
    return false;
  }
};

// Function to delete a stick command by cmd
const deleteCmd = async (cmd) => {
  try {
    const result = await StickCmd.deleteOne({ cmd });
    if (result.deletedCount > 0) {
      console.log(`Commande ${cmd} supprimée avec succès.`);
    } else {
      console.log(`Aucune commande ${cmd} trouvée.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du stickcmd :", error);
  }
};

// Function to get a stick command by ID
const getCmdById = async (id) => {
  try {
    const cmd = await StickCmd.findOne({ id });
    return cmd ? cmd.cmd : null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du stickcmd par id :", error);
    return null;
  }
};

// Function to get all stick commands
const getAllStickCmds = async () => {
  try {
    const cmds = await StickCmd.find({});
    return cmds;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de toutes les commandes stickcmd :", error);
    return [];
  }
};

// Example of initialization: check if the "stickcmd" collection has any documents
const initializeCollection = async () => {
  const count = await StickCmd.countDocuments();
  if (count === 0) {
    console.log("La collection 'stickcmd' est vide.");
  } else {
    console.log(`La collection 'stickcmd' contient ${count} commandes.`);
  }
};

// Run the initialization check
initializeCollection();

module.exports = {
  addStickCmd,
  deleteCmd,
  getCmdById,
  inStickCmd,
  getAllStickCmds,
};
