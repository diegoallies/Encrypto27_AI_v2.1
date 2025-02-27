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

// Define the Schema for "mention"
const mentionSchema = new mongoose.Schema({
  status: { type: String, default: 'non' },
  url: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true }
});

// Create the Model
const Mention = mongoose.model("Mention", mentionSchema);

// Function to add or update mention data
const addOrUpdateDataInMention = async (url, type, message) => {
  try {
    const existingMention = await Mention.findOneAndUpdate(
      { id: 1 }, // MongoDB doesn't use 'id' like PostgreSQL, but you can add 'id' as a unique field.
      { url, type, message }, // New data
      { upsert: true, new: true } // Insert if not found, and return the updated document
    );
    console.log("✅ Mention data added or updated successfully.");
  } catch (error) {
    console.error("❌ Error adding or updating mention data:", error);
  }
};

// Function to modify the status of mention with id 1
const modifierStatusId1 = async (nouveauStatus) => {
  try {
    const result = await Mention.updateOne(
      { id: 1 },
      { $set: { status: nouveauStatus } }
    );
    console.log("✅ Status updated successfully for ID 1.");
  } catch (error) {
    console.error("❌ Error updating status for ID 1:", error);
  }
};

// Function to retrieve all mention values
const recupererToutesLesValeurs = async () => {
  try {
    const mentions = await Mention.find(); // Find all documents
    console.log("✅ Retrieved all mention values:", mentions);
    return mentions;
  } catch (error) {
    console.error("❌ Error retrieving all mention values:", error);
    return [];
  }
};

// Initialize the MongoDB schema if necessary
const initializeCollection = async () => {
  const mentionCount = await Mention.countDocuments();
  if (mentionCount === 0) {
    await new Mention({ id: 1 }).save(); // Initialize with a default entry
    console.log("✅ Initialized the mention collection.");
  }
};

// Execute the collection initialization
initializeCollection();

module.exports = {
  addOrUpdateDataInMention,
  recupererToutesLesValeurs,
  modifierStatusId1
};
