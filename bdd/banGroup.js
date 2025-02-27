require("dotenv").config();
const mongoose = require("mongoose");

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

// Define the Schema for "banGroup"
const banGroupSchema = new mongoose.Schema({
  groupeJid: { type: String, required: true, unique: true },
});

// Create the Model
const BanGroup = mongoose.model("BanGroup", banGroupSchema);

// Function to add a group to the ban list
const addGroupToBanList = async (groupeJid) => {
  try {
    const newGroup = new BanGroup({ groupeJid });
    await newGroup.save();
    console.log(`✅ Group JID ${groupeJid} added to the ban list.`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`⚠️ Group JID ${groupeJid} is already banned.`);
    } else {
      console.error("❌ Error adding banned group:", error);
    }
  }
};

// Function to check if a group is banned
const isGroupBanned = async (groupeJid) => {
  try {
    const exists = await BanGroup.exists({ groupeJid });
    return !!exists;
  } catch (error) {
    console.error("❌ Error checking banned group:", error);
    return false;
  }
};

// Function to remove a group from the ban list
const removeGroupFromBanList = async (groupeJid) => {
  try {
    const result = await BanGroup.deleteOne({ groupeJid });
    if (result.deletedCount > 0) {
      console.log(`✅ Group JID ${groupeJid} removed from the ban list.`);
    } else {
      console.log(`⚠️ Group JID ${groupeJid} was not found in the ban list.`);
    }
  } catch (error) {
    console.error("❌ Error removing banned group:", error);
  }
};

module.exports = {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
};
