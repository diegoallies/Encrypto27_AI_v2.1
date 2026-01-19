const { run, get } = require('./sqlite-db');

// Function to add or update JID in 'antibot'
const atbajouterOuMettreAJourJid = async (jid, etat) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antibot (jid, etat) VALUES (?, ?)',
      [jid, etat]
    );
    console.log(`✅ JID ${jid} added/updated successfully in 'antibot'`);
  } catch (error) {
    console.error("❌ Error adding/updating JID in 'antibot':", error);
  }
};

// Function to update action for a JID
const atbmettreAJourAction = async (jid, action) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antibot (jid, action) VALUES (?, ?)',
      [jid, action]
    );
    console.log(`✅ Action updated successfully for JID ${jid}`);
  } catch (error) {
    console.error("❌ Error updating action for JID:", error);
  }
};

// Function to check if a JID has 'oui' status
const atbverifierEtatJid = async (jid) => {
  try {
    const data = await get('SELECT etat FROM antibot WHERE jid = ?', [jid]);
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Error checking JID status:", error);
    return false;
  }
};

// Function to retrieve the action of a JID
const atbrecupererActionJid = async (jid) => {
  try {
    const data = await get('SELECT action FROM antibot WHERE jid = ?', [jid]);
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
