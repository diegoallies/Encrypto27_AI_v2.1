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

// Define the Schema for "banUser"
const banUserSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
});

// Create the Model
const BanUser = mongoose.model("BanUser", banUserSchema);

// Function to add a user to the ban list
const addUserToBanList = async (jid) => {
  try {
    const newUser = new BanUser({ jid });
    await newUser.save();
    console.log(`✅ User JID ${jid} added to the ban list.`);
  } catch (error) {
    if (error.code === 11000) {
      console.log(`⚠️ User JID ${jid} is already banned.`);
    } else {
      console.error("❌ Error adding banned user:", error);
    }
  }
};

// Function to check if a user is banned
const isUserBanned = async (jid) => {
  try {
    const exists = await BanUser.exists({ jid });
    return !!exists;
  } catch (error) {
    console.error("❌ Error checking banned user:", error);
    return false;
  }
};

// Function to remove a user from the ban list
const removeUserFromBanList = async (jid) => {
  try {
    const result = await BanUser.deleteOne({ jid });
    if (result.deletedCount > 0) {
      console.log(`✅ User JID ${jid} removed from the ban list.`);
    } else {
      console.log(`⚠️ User JID ${jid} was not found in the ban list.`);
    }
  } catch (error) {
    console.error("❌ Error removing banned user:", error);
  }
};

module.exports = {
  addUserToBanList,
  isUserBanned,
  removeUserFromBanList,
};
