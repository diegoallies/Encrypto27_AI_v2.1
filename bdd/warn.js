const { run, get } = require('./sqlite-db');

// Fonction pour créer un utilisateur avec un count de warning
async function ajouterUtilisateurAvecWarnCount(jid) {
  try {
    const user = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
    if (user) {
      await run('UPDATE warn SET warnCount = warnCount + 1 WHERE jid = ?', [jid]);
      const updated = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
      console.log(`Utilisateur ${jid} mis à jour avec un warn_count de ${updated.warnCount}.`);
    } else {
      await run('INSERT INTO warn (jid, warnCount) VALUES (?, 1)', [jid]);
      console.log(`Utilisateur ${jid} ajouté avec un warn_count de 1.`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout ou de la mise à jour de l'utilisateur :", error);
  }
}

// Fonction pour récupérer le warn_count par JID
async function getWarnCountByJID(jid) {
  try {
    const user = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
    return user ? user.warnCount : 0;
  } catch (error) {
    console.error("Erreur lors de la récupération du warn_count :", error);
    return -1;
  }
}

// Fonction pour réinitialiser le warn_count à 0 pour un utilisateur spécifique
async function resetWarnCountByJID(jid) {
  try {
    const result = await run('UPDATE warn SET warnCount = 0 WHERE jid = ?', [jid]);
    if (result.changes > 0) {
      console.log(`Le warn_count de l'utilisateur ${jid} a été réinitialisé à 0.`);
    } else {
      console.log(`Utilisateur ${jid} non trouvé.`);
    }
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du warn_count :", error);
  }
}

module.exports = {
  ajouterUtilisateurAvecWarnCount,
  getWarnCountByJID,
  resetWarnCountByJID,
};
