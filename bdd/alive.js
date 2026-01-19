const { run, get } = require('./sqlite-db');

// Function to add or update data in 'alive'
const addOrUpdateDataInAlive = async (message, lien) => {
  try {
    const existing = await get('SELECT id FROM alive WHERE id = 1');
    if (existing) {
      await run('UPDATE alive SET message = ?, lien = ? WHERE id = 1', [message, lien]);
    } else {
      await run('INSERT INTO alive (id, message, lien) VALUES (1, ?, ?)', [message, lien]);
    }
    console.log("✅ Data added/updated in 'alive'");
  } catch (error) {
    console.error("❌ Error adding/updating data in 'alive':", error);
  }
};

// Function to get data from 'alive'
const getDataFromAlive = async () => {
  try {
    const data = await get('SELECT message, lien FROM alive WHERE id = 1');
    if (data) {
      return { message: data.message, lien: data.lien };
    } else {
      console.log("ℹ️ No data found in 'alive'.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving data from 'alive':", error);
    return null;
  }
};

module.exports = {
  addOrUpdateDataInAlive,
  getDataFromAlive,
};
