require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB URI (use environment variable if set)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// Check if already connected
const connectToDatabase = async () => {
  try {
    // Only attempt to connect if not already connected
    if (mongoose.connection.readyState !== 1) { 
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
    process.exit(1); // Exit process on connection failure
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
      console.log(`Groupe JID ${groupeJid} already in the onlyAdmin list.`);
      return;
    }

    const newGroup = new OnlyAdmin({ groupeJid });
    await newGroup.save();
    console.log(`Groupe JID ${groupeJid} added to the onlyAdmin list.`);
  } catch (error) {
    console.error("❌ Error while adding group to onlyAdmin list:", error);
  }
};

// Function to check if a group is in the "onlyAdmin" list
const isGroupOnlyAdmin = async (groupeJid) => {
  try {
    const group = await OnlyAdmin.findOne({ groupeJid });
    return group !== null; // If found, return true; otherwise, false
  } catch (error) {
    console.error("❌ Error while checking if group is in onlyAdmin list:", error);
    return false;
  }
};

// Function to remove a group from the "onlyAdmin" list
const removeGroupFromOnlyAdminList = async (groupeJid) => {
  try {
    const result = await OnlyAdmin.deleteOne({ groupeJid });
    if (result.deletedCount > 0) {
      console.log(`Groupe JID ${groupeJid} removed from the onlyAdmin list.`);
    } else {
      console.log(`No group found with JID ${groupeJid} in the onlyAdmin list.`);
    }
  } catch (error) {
    console.error("❌ Error while removing group from onlyAdmin list:", error);
  }
};

// Function to initialize and check the "onlyAdmin" collection
const initializeCollection = async () => {
  try {
    const count = await OnlyAdmin.countDocuments();
    if (count === 0) {
      console.log("The 'onlyAdmin' collection is empty.");
    } else {
      console.log(`The 'onlyAdmin' collection contains ${count} groups.`);
    }
  } catch (error) {
    console.error("❌ Error during collection initialization:", error);
  }
};

// Initialize connection and collection check
connectToDatabase()
  .then(() => initializeCollection())
  .catch((err) => {
    console.error("❌ Initialization error:", err);
    process.exit(1); // Exit process on initialization failure
  });

// Export the functions for use elsewhere
module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};
