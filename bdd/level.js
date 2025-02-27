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

// Define the Schema for "users_rank"
const userRankSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
});

// Create the Model
const UserRank = mongoose.model("UserRank", userRankSchema);

// Function to add or update user data (XP and messages)
const ajouterOuMettreAJourUserData = async (jid) => {
  try {
    const user = await UserRank.findOneAndUpdate(
      { jid },
      { $inc: { xp: 10, messages: 1 } }, // Increment XP and messages
      { upsert: true, new: true } // Insert new document if not found
    );
    console.log(`✅ User ${jid} data updated or added.`);
  } catch (error) {
    console.error("❌ Error updating or adding user data:", error);
  }
};

// Function to get the number of messages and XP for a given JID
const getMessagesAndXPByJID = async (jid) => {
  try {
    const user = await UserRank.findOne({ jid });
    if (user) {
      return { messages: user.messages, xp: user.xp };
    } else {
      return { messages: 0, xp: 0 }; // Default values if user not found
    }
  } catch (error) {
    console.error("❌ Error retrieving user data:", error);
    return { messages: 0, xp: 0 }; // Default values on error
  }
};

// Function to get the bottom 10 users (by XP)
const getBottom10Users = async () => {
  try {
    const users = await UserRank.find()
      .sort({ xp: -1 }) // Sort by XP descending
      .limit(10); // Limit to 10 users
    return users.map(user => ({ jid: user.jid, xp: user.xp, messages: user.messages }));
  } catch (error) {
    console.error("❌ Error retrieving bottom 10 users:", error);
    return []; // Return empty array on error
  }
};

module.exports = {
  ajouterOuMettreAJourUserData,
  getMessagesAndXPByJID,
  getBottom10Users,
};
