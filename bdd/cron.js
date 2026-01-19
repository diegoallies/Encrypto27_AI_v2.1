const { run, get, all } = require('./sqlite-db');

// Function to get all cron data
const getCron = async () => {
  try {
    return await all('SELECT * FROM cron');
  } catch (error) {
    console.error("❌ Error retrieving cron data:", error);
    return [];
  }
};

// Function to add or update a cron entry
const addCron = async (group_id, field, value) => {
  try {
    const existing = await get('SELECT * FROM cron WHERE group_id = ?', [group_id]);
    if (existing) {
      await run(`UPDATE cron SET ${field} = ? WHERE group_id = ?`, [value, group_id]);
    } else {
      const defaults = { mute_at: null, unmute_at: null };
      defaults[field] = value;
      await run('INSERT INTO cron (group_id, mute_at, unmute_at) VALUES (?, ?, ?)',
        [group_id, defaults.mute_at, defaults.unmute_at]);
    }
    console.log(`✅ Cron entry updated for group ${group_id}`);
  } catch (error) {
    console.error("❌ Error adding/updating cron data:", error);
  }
};

// Function to get cron data by group_id
const getCronById = async (group_id) => {
  try {
    return await get('SELECT * FROM cron WHERE group_id = ?', [group_id]);
  } catch (error) {
    console.error("❌ Error retrieving cron data by ID:", error);
    return null;
  }
};

// Function to delete a cron entry
const delCron = async (group_id) => {
  try {
    const result = await run('DELETE FROM cron WHERE group_id = ?', [group_id]);
    if (result.changes > 0) {
      console.log(`✅ Cron entry for group_id ${group_id} deleted.`);
    } else {
      console.log(`⚠️ No cron entry found for group_id ${group_id}.`);
    }
  } catch (error) {
    console.error("❌ Error deleting cron entry:", error);
  }
};

module.exports = {
  getCron,
  addCron,
  delCron,
  getCronById,
};
