const { run, get, all } = require('./sqlite-db');

// Function to add a sudo number
const addSudoNumber = async (jid) => {
  try {
    const existing = await get('SELECT jid FROM sudo WHERE jid = ?', [jid]);
    if (existing) {
      console.log(`Le numéro ${jid} est déjà autorisé.`);
      return;
    }
    await run('INSERT INTO sudo (jid) VALUES (?)', [jid]);
    console.log(`Numéro ${jid} ajouté à la liste des numéros autorisés.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du numéro de téléphone autorisé :", error);
  }
};

// Function to check if a sudo number exists
const issudo = async (jid) => {
  try {
    const sudo = await get('SELECT jid FROM sudo WHERE jid = ?', [jid]);
    return sudo !== null;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du numéro autorisé :", error);
    return false;
  }
};

// Function to remove a sudo number
const removeSudoNumber = async (jid) => {
  try {
    const result = await run('DELETE FROM sudo WHERE jid = ?', [jid]);
    if (result.changes > 0) {
      console.log(`Numéro ${jid} supprimé de la liste des numéros autorisés.`);
    } else {
      console.log(`Numéro ${jid} non trouvé.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du numéro de téléphone autorisé :", error);
  }
};

// Function to get all sudo numbers
const getAllSudoNumbers = async () => {
  try {
    const sudoNumbers = await all('SELECT jid FROM sudo');
    return sudoNumbers.map(sudo => sudo.jid);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des numéros autorisés :", error);
    return [];
  }
};

// Function to check if the sudo table is empty
const isSudoTableNotEmpty = async () => {
  try {
    const result = await get('SELECT COUNT(*) as count FROM sudo');
    return result && result.count > 0;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de la table 'sudo' :", error);
    return false;
  }
};

module.exports = {
  addSudoNumber,
  issudo,
  removeSudoNumber,
  getAllSudoNumbers,
  isSudoTableNotEmpty,
};
