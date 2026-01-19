const { run, get } = require('./sqlite-db');

// Fonction pour ajouter ou mettre à jour un JID
const ajouterOuMettreAJourJid = async (jid, etat) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antilien (jid, etat) VALUES (?, ?)',
      [jid, etat]
    );
    console.log(`✅ JID ${jid} ajouté/mis à jour avec succès dans 'antilien'`);
  } catch (error) {
    console.error("❌ Erreur d'ajout/mise à jour du JID dans 'antilien':", error);
  }
};

// Fonction pour mettre à jour l'action d'un JID
const mettreAJourAction = async (jid, action) => {
  try {
    await run(
      'INSERT OR REPLACE INTO antilien (jid, action) VALUES (?, ?)',
      [jid, action]
    );
    console.log(`✅ Action mise à jour pour JID ${jid}`);
  } catch (error) {
    console.error("❌ Erreur de mise à jour de l'action du JID:", error);
  }
};

// Fonction pour vérifier si un JID a l'état 'oui'
const verifierEtatJid = async (jid) => {
  try {
    const data = await get('SELECT etat FROM antilien WHERE jid = ?', [jid]);
    return data ? data.etat === "oui" : false;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de l'état du JID:", error);
    return false;
  }
};

// Fonction pour récupérer l'action associée à un JID
const recupererActionJid = async (jid) => {
  try {
    const data = await get('SELECT action FROM antilien WHERE jid = ?', [jid]);
    return data ? data.action : "supp"; // Valeur par défaut: 'supp'
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'action du JID:", error);
    return "supp";
  }
};

module.exports = {
  mettreAJourAction,
  ajouterOuMettreAJourJid,
  verifierEtatJid,
  recupererActionJid,
};
