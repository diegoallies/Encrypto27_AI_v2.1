const { run, get, all } = require('./sqlite-db');

// Function to add a group to the "onlyAdmin" list
const addGroupToOnlyAdminList = async (groupeJid) => {
  try {
    const existing = await get('SELECT jid FROM onlyAdmin WHERE jid = ?', [groupeJid]);
    if (existing) {
      console.log(`Groupe JID ${groupeJid} already in the onlyAdmin list.`);
      return;
    }
    await run('INSERT INTO onlyAdmin (jid) VALUES (?)', [groupeJid]);
    console.log(`Groupe JID ${groupeJid} added to the onlyAdmin list.`);
  } catch (error) {
    console.error("❌ Error while adding group to onlyAdmin list:", error);
  }
};

// Function to check if a group is in the "onlyAdmin" list
const isGroupOnlyAdmin = async (groupeJid) => {
  try {
    const group = await get('SELECT jid FROM onlyAdmin WHERE jid = ?', [groupeJid]);
    return group !== null;
  } catch (error) {
    console.error("❌ Error while checking if group is in onlyAdmin list:", error);
    return false;
  }
};

// Function to remove a group from the "onlyAdmin" list
const removeGroupFromOnlyAdminList = async (groupeJid) => {
  try {
    const result = await run('DELETE FROM onlyAdmin WHERE jid = ?', [groupeJid]);
    if (result.changes > 0) {
      console.log(`Groupe JID ${groupeJid} removed from the onlyAdmin list.`);
    } else {
      console.log(`No group found with JID ${groupeJid} in the onlyAdmin list.`);
    }
  } catch (error) {
    console.error("❌ Error while removing group from onlyAdmin list:", error);
  }
};

// Export the functions for use elsewhere
module.exports = {
  addGroupToOnlyAdminList,
  isGroupOnlyAdmin,
  removeGroupFromOnlyAdminList,
};
