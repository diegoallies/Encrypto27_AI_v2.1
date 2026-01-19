const { run, get, all } = require('./sqlite-db');

// Function to update the 'choix' value in the 'theme' collection
async function updateThemeValue(value) {
  try {
    await run('INSERT OR REPLACE INTO theme (jid, theme) VALUES (?, ?)', ['default', value]);
    console.log("The 'choix' value has been updated successfully.");
  } catch (error) {
    console.error("Error updating the 'choix' value:", error);
  }
}

// Function to get the 'choix' value from the 'theme' collection
async function getThemeChoice() {
  try {
    const theme = await get('SELECT theme FROM theme WHERE jid = ?', ['default']);
    return theme ? theme.theme : 'default';
  } catch (error) {
    console.error("Error getting the theme choice:", error);
    return 'default';
  }
}

// Function to get theme information by ID
async function getThemeInfoById(id) {
  try {
    const theme = await get('SELECT * FROM theme WHERE jid = ?', [id]);
    return theme ? { auteur: theme.auteur, liens: theme.liens, nom: theme.nom } : null;
  } catch (error) {
    console.error("Error getting theme info by ID:", error);
    return null;
  }
}

// Function to get all theme information
async function getAllThemesInfo() {
  try {
    const themes = await all('SELECT * FROM theme ORDER BY jid');
    return themes;
  } catch (error) {
    console.error("Error getting all themes info:", error);
    return [];
  }
}

module.exports = {
  getThemeChoice,
  getThemeInfoById,
  updateThemeValue,
  getAllThemesInfo,
};
