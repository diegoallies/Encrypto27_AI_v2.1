const { run, get } = require('./sqlite-db');

// Fonction pour ajouter ou mettre à jour un JID
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

// Fonction pour mettre à jour l'action d'un JID
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

// Fonction pour vérifier si un JID a l'état 'oui'
const verifierEtatJid = async (jid) => {
  try {
    const data = await get('SELECT etat FROM antilien WHERE jid = ?', [jid]);
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Error checking JID status:", error);
    return false;
  }
};

// Fonction pour récupérer l'action associée à un JID
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
