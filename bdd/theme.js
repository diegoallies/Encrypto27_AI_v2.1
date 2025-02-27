require('dotenv').config();
const mongoose = require('mongoose');

// Get the MongoDB URI from environment or use a default one
const dbUrl = s.DATABASE_URL || 'mongodb://localhost:27017/mydb';

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

const themeSchema = new mongoose.Schema({
  choix: { type: String, required: true },
});

const Theme = mongoose.model('Theme', themeSchema);

// Function to create the 'theme' collection if it doesn't exist
async function createThemeCollection() {
  try {
    const theme = await Theme.findOne();
    if (!theme) {
      await Theme.create({ choix: 'default' });
      console.log("The 'theme' collection has been created with the default value.");
    }
  } catch (error) {
    console.error("Error creating the 'theme' collection:", error);
  }
}

createThemeCollection();

// Function to update the 'choix' value in the 'theme' collection
async function updateThemeValue(value) {
  try {
    await Theme.updateOne({ _id: 1 }, { choix: value });
    console.log("The 'choix' value has been updated successfully.");
  } catch (error) {
    console.error("Error updating the 'choix' value:", error);
  }
}

// Function to get the 'choix' value from the 'theme' collection
async function getThemeChoice() {
  try {
    const theme = await Theme.findOne({ _id: 1 });
    return theme ? theme.choix : null;
  } catch (error) {
    console.error("Error getting the theme choice:", error);
    return null;
  }
}

// Function to get theme information by ID
async function getThemeInfoById(id) {
  try {
    const theme = await Theme.findById(id);
    if (theme) {
      return { auteur: theme.auteur, liens: theme.liens, nom: theme.nom };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting theme info by ID:", error);
    return null;
  }
}

// Function to get all theme information
async function getAllThemesInfo() {
  try {
    const themes = await Theme.find().sort({ _id: 1 });
    return themes;
  } catch (error) {
    console.error("Error getting all themes info:", error);
    return [];
  }
}

module.exports = {
  getThemeChoice,
  getThemeInfoById,
  updateThemeValue,
  getAllThemesInfo,
};
