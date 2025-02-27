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

// Define the Schema for "hentai"
const hentaiSchema = new mongoose.Schema({
  groupeJid: { type: String, required: true, unique: true },
});

// Create the Model
const Hentai = mongoose.model("Hentai", hentaiSchema);

// Function to add a group to the hentai list
const addToHentaiList = async (groupeJid) => {
  try {
    const result = await Hentai.findOneAndUpdate(
      { groupeJid },
      { groupeJid },
      { upsert: true, new: true }
    );
    console.log(`✅ Group JID ${groupeJid} added to the hentai list.`);
  } catch (error) {
    console.error("❌ Error adding group to hentai list:", error);
  }
};

// Function to check if a group is in the hentai list
const checkFromHentaiList = async (groupeJid) => {
  try {
    const result = await Hentai.findOne({ groupeJid });
    return result ? true : false;
  } catch (error) {
    console.error("❌ Error checking group from hentai list:", error);
    return false;
  }
};

// Function to remove a group from the hentai list
const removeFromHentaiList = async (groupeJid) => {
  try {
    const result = await Hentai.deleteOne({ groupeJid });
    if (result.deletedCount > 0) {
      console.log(`✅ Group JID ${groupeJid} removed from the hentai list.`);
    } else {
      console.log(`⚠️ No group JID ${groupeJid} found in the hentai list.`);
    }
  } catch (error) {
    console.error("❌ Error removing group from hentai list:", error);
  }
};

module.exports = {
  addToHentaiList,
  checkFromHentaiList,
  removeFromHentaiList,
};
