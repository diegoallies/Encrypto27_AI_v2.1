const { run, get } = require('./sqlite-db');

// Function to add a group to the hentai list
const addToHentaiList = async (groupeJid) => {
  try {
    await run('INSERT OR REPLACE INTO hentai (jid, enabled) VALUES (?, 1)', [groupeJid]);
    console.log(`✅ Group JID ${groupeJid} added to the hentai list.`);
  } catch (error) {
    console.error("❌ Error adding group to hentai list:", error);
  }
};

// Function to check if a group is in the hentai list
const checkFromHentaiList = async (groupeJid) => {
  try {
    const result = await get('SELECT jid FROM hentai WHERE jid = ? AND enabled = 1', [groupeJid]);
    return result ? true : false;
  } catch (error) {
    console.error("❌ Error checking group from hentai list:", error);
    return false;
  }
};

// Function to remove a group from the hentai list
const removeFromHentaiList = async (groupeJid) => {
  try {
    const result = await run('DELETE FROM hentai WHERE jid = ?', [groupeJid]);
    if (result.changes > 0) {
      console.log(`✅ Group JID ${groupeJid} removed from the hentai list.`);
    } else {
      console.log(`⚠️ No group JID ${groupeJid} found in the hentai list.`);
    }
  } catch (error) {
    console.error("❌ Error removing group from hentai list:", error);
  }
};

module.exports = {
  addToHentaiList,
  checkFromHentaiList,
  removeFromHentaiList,
};
