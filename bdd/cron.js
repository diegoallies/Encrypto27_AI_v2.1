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

// Define the Schema for "cron"
const cronSchema = new mongoose.Schema({
  group_id: { type: String, required: true, unique: true },
  mute_at: { type: String, default: null },
  unmute_at: { type: String, default: null },
});

// Create the Model
const Cron = mongoose.model("Cron", cronSchema);

// Function to get all cron data
const getCron = async () => {
  try {
    return await Cron.find({});
  } catch (error) {
    console.error("❌ Error retrieving cron data:", error);
    return [];
  }
};

// Function to add or update a cron entry
const addCron = async (group_id, field, value) => {
  try {
    let update = {};
    update[field] = value;

    const result = await Cron.findOneAndUpdate(
      { group_id },
      { $set: update },
      { upsert: true, new: true }
    );

    console.log(`✅ Cron entry updated:`, result);
  } catch (error) {
    console.error("❌ Error adding/updating cron data:", error);
  }
};

// Function to get cron data by group_id
const getCronById = async (group_id) => {
  try {
    return await Cron.findOne({ group_id });
  } catch (error) {
    console.error("❌ Error retrieving cron data by ID:", error);
    return null;
  }
};

// Function to delete a cron entry
const delCron = async (group_id) => {
  try {
    const result = await Cron.deleteOne({ group_id });
    if (result.deletedCount > 0) {
      console.log(`✅ Cron entry for group_id ${group_id} deleted.`);
    } else {
      console.log(`⚠️ No cron entry found for group_id ${group_id}.`);
    }
  } catch (error) {
    console.error("❌ Error deleting cron entry:", error);
  }
};

module.exports = {
  getCron,
  addCron,
  delCron,
  getCronById,
};
