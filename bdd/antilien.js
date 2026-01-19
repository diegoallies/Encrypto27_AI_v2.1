const { run, get } = require('./sqlite-db');

// Function to add or update a JID
const ajouterOuMettreAJourJid = async (jid, etat) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antilien (jid, etat) VALUES (?, ?)',
      [jid, etat]
    );
    console.log(`✅ JID ${jid} added/updated successfully in 'antilien'`);
  } catch (error) {
    console.error("❌ Error adding/updating JID in 'antilien':", error);
  }
};

// Function to update a JID's action
const mettreAJourAction = async (jid, action) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antilien (jid, action) VALUES (?, ?)',
      [jid, action]
    );
    console.log(`✅ Action updated for JID ${jid}`);
  } catch (error) {
    console.error("❌ Error updating JID action:", error);
  }
};

// Function to check if a JID has status 'yes'
const verifierEtatJid = async (jid) => {
  try {
    const data = await get('SELECT etat FROM antilien WHERE jid = ?', [jid]);
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Error checking JID status:", error);
    return false;
  }
};

// Function to retrieve the action associated with a JID
const recupererActionJid = async (jid) => {
  try {
    const data = await get('SELECT action FROM antilien WHERE jid = ?', [jid]);
    return data ? data.action : "supp"; // Valeur par défaut: 'supp'
  } catch (error) {
    console.error("❌ Error retrieving JID action:", error);
    return "supp";
  }
};

module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
};
