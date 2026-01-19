const { run, get } = require('./sqlite-db');

// Function to add a group to the ban list
const addGroupToBanList = async (groupeJid) => {
  try {
    await run('INSERT OR IGNORE INTO banGroup (jid) VALUES (?)', [groupeJid]);
    console.log(`✅ Group JID ${groupeJid} added to the ban list.`);
  } catch (error) {
    console.error("❌ Error adding banned group:", error);
  }
};

// Function to check if a group is banned
const isGroupBanned = async (groupeJid) => {
  try {
    const result = await get('SELECT jid FROM banGroup WHERE jid = ?', [groupeJid]);
    return !!result;
  } catch (error) {
    console.error("❌ Error checking banned group:", error);
    return false;
  }
};

// Function to remove a group from the ban list
const removeGroupFromBanList = async (groupeJid) => {
  try {
    const result = await run('DELETE FROM banGroup WHERE jid = ?', [groupeJid]);
    if (result.changes > 0) {
      console.log(`✅ Group JID ${groupeJid} removed from the ban list.`);
    } else {
      console.log(`⚠️ Group JID ${groupeJid} was not found in the ban list.`);
    }
  } catch (error) {
    console.error("❌ Error removing banned group:", error);
  }
};

module.exports = {
  addGroupToBanList,
  isGroupBanned,
  removeGroupFromBanList,
};
