const { run, get, all } = require('./sqlite-db');

// Function to add or update mention data
const addOrUpdateDataInMention = async (url, type, message) => {
  try {
    const existing = await get('SELECT id FROM mention WHERE id = 1');
    if (existing) {
      await run('UPDATE mention SET url = ?, type = ?, message = ? WHERE id = 1', [url, type, message]);
    } else {
      await run('INSERT INTO mention (id, status, url, type, message) VALUES (1, ?, ?, ?, ?)',
        ['non', url, type, message]);
    }
    console.log("✅ Mention data added or updated successfully.");
  } catch (error) {
    console.error("❌ Error adding or updating mention data:", error);
  }
};

// Function to modify the status of mention with id 1
const modifierStatusId1 = async (nouveauStatus) => {
  try {
    await run('UPDATE mention SET status = ? WHERE id = 1', [nouveauStatus]);
    console.log("✅ Status updated successfully for ID 1.");
  } catch (error) {
    console.error("❌ Error updating status for ID 1:", error);
  }
};

// Function to retrieve all mention values
const recupererToutesLesValeurs = async () => {
  try {
    const mentions = await all('SELECT * FROM mention');
    console.log("✅ Retrieved all mention values:", mentions);
    return mentions;
  } catch (error) {
    console.error("❌ Error retrieving all mention values:", error);
    return [];
  }
};

module.exports = {
  addOrUpdateDataInMention,
  recupererToutesLesValeurs,
  modifierStatusId1
};
