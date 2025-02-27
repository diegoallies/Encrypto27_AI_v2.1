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
catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema for 'antibot'
const antibotSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  etat: { type: String, default: "non" }, // Default to 'non'
  action: { type: String, default: "supp" }, // Default to 'supp'
});

// Create Model
const Antibot = mongoose.model("Antibot", antibotSchema);

// Function to add or update JID in 'antibot'
const atbajouterOuMettreAJourJid = async (jid, etat) => {
  try {
    const updated = await Antibot.findOneAndUpdate(
      { jid },
      { etat },
      { upsert: true, new: true }
    );
    console.log(`✅ JID ${jid} added/updated successfully in 'antibot':`, updated);
  } catch (error) {
    console.error("❌ Error adding/updating JID in 'antibot':", error);
  }
};

// Function to update action for a JID
const atbmettreAJourAction = async (jid, action) => {
  try {
    const updated = await Antibot.findOneAndUpdate(
      { jid },
      { action },
      { upsert: true, new: true }
    );
    console.log(`✅ Action updated successfully for JID ${jid}:`, updated);
  } catch (error) {
    console.error("❌ Error updating action for JID:", error);
  }
};

// Function to check if a JID has 'oui' status
const atbverifierEtatJid = async (jid) => {
  try {
    const data = await Antibot.findOne({ jid });
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Error checking JID status:", error);
    return false;
  }
};

// Function to retrieve the action of a JID
const atbrecupererActionJid = async (jid) => {
  try {
    const data = await Antibot.findOne({ jid });
    return data ? data.action : "supp"; // Default action is 'supp'
  } catch (error) {
    console.error("❌ Error retrieving action for JID:", error);
    return "supp";
  }
};

module.exports = {
  atbmettreAJourAction,
  atbajouterOuMettreAJourJid,
  atbverifierEtatJid,
  atbrecupererActionJid,
};
