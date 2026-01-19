const { run, get } = require('./sqlite-db');

// Function to add a user to the ban list
const addUserToBanList = async (jid) => {
  try {
    await run('INSERT OR IGNORE INTO banUser (jid) VALUES (?)', [jid]);
    console.log(`✅ User JID ${jid} added to the ban list.`);
  } catch (error) {
    console.error("❌ Error adding banned user:", error);
  }
};

// Function to check if a user is banned
const isUserBanned = async (jid) => {
  try {
    const result = await get('SELECT jid FROM banUser WHERE jid = ?', [jid]);
    return !!result;
  } catch (error) {
    console.error("❌ Error checking banned user:", error);
    return false;
  }
};

// Function to remove a user from the ban list
const removeUserFromBanList = async (jid) => {
  try {
    const result = await run('DELETE FROM banUser WHERE jid = ?', [jid]);
    if (result.changes > 0) {
      console.log(`✅ User JID ${jid} removed from the ban list.`);
    } else {
      console.log(`⚠️ User JID ${jid} was not found in the ban list.`);
    }
  } catch (error) {
    console.error("❌ Error removing banned user:", error);
  }
};

module.exports = {
  addUserToBanList,
  isUserBanned,
  removeUserFromBanList,
};
