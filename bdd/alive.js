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

// Define Schema for 'alive'
const aliveSchema = new mongoose.Schema({
  message: { type: String, required: true },
  lien: { type: String, required: true },
});

// Create Model
const Alive = mongoose.model("Alive", aliveSchema);

// Function to add or update data in 'alive'
const addOrUpdateDataInAlive = async (message, lien) => {
  try {
    const updated = await Alive.findOneAndUpdate(
      {}, // No filter → Always update the first document
      { message, lien },
      { upsert: true, new: true }
    );
    console.log("✅ Data added/updated in 'alive':", updated);
  } catch (error) {
    console.error("❌ Error adding/updating data in 'alive':", error);
  }
};

// Function to get data from 'alive'
const getDataFromAlive = async () => {
  try {
    const data = await Alive.findOne();
    if (data) {
      return { message: data.message, lien: data.lien };
    } else {
      console.log("ℹ️ No data found in 'alive'.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving data from 'alive':", error);
    return null;
  }
};

module.exports = {
  addOrUpdateDataInAlive,
  getDataFromAlive,
};
