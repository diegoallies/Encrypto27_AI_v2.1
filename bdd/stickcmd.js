const { run, get, all } = require('./sqlite-db');

// Function to add a stick command
const addStickCmd = async (cmd, id) => {
  try {
    const existing = await get('SELECT cmd FROM stickcmd WHERE cmd = ?', [cmd]);
    if (existing) {
      console.log(`La commande ${cmd} existe déjà.`);
      return;
    }
    await run('INSERT INTO stickcmd (cmd, id) VALUES (?, ?)', [cmd, id]);
    console.log(`Commande ${cmd} ajoutée avec succès.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du stickcmd :", error);
  }
};

// Function to check if a stick command exists by ID
const inStickCmd = async (id) => {
  try {
    const cmd = await get('SELECT id FROM stickcmd WHERE id = ?', [id]);
    return cmd !== null;
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du stickcmd :", error);
    return false;
  }
};

// Function to delete a stick command by cmd
const deleteCmd = async (cmd) => {
  try {
    const result = await run('DELETE FROM stickcmd WHERE cmd = ?', [cmd]);
    if (result.changes > 0) {
      console.log(`Commande ${cmd} supprimée avec succès.`);
    } else {
      console.log(`Aucune commande ${cmd} trouvée.`);
    }
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du stickcmd :", error);
  }
};

// Function to get a stick command by ID
const getCmdById = async (id) => {
  try {
    const cmd = await get('SELECT cmd FROM stickcmd WHERE id = ?', [id]);
    return cmd ? cmd.cmd : null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du stickcmd par id :", error);
    return null;
  }
};

// Function to get all stick commands
const getAllStickCmds = async () => {
  try {
    return await all('SELECT * FROM stickcmd');
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de toutes les commandes stickcmd :", error);
    return [];
  }
};

module.exports = {
  addStickCmd,
  deleteCmd,
  getCmdById,
  inStickCmd,
  getAllStickCmds,
};
