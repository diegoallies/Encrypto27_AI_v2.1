const { run, get } = require('./sqlite-db');

// Function to create a user with a warning count
async function ajouterUtilisateurAvecWarnCount(jid) {
  try {
    const user = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
    if (user) {
      await run('UPDATE warn SET warnCount = warnCount + 1 WHERE jid = ?', [jid]);
      const updated = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
      console.log(`User ${jid} updated with warn_count of ${updated.warnCount}.`);
    } else {
      await run('INSERT INTO warn (jid, warnCount) VALUES (?, 1)', [jid]);
      console.log(`User ${jid} added with warn_count of 1.`);
    }
  } catch (error) {
    console.error("Error adding or updating user:", error);
  }
}

// Function to retrieve warn_count by JID
async function getWarnCountByJID(jid) {
  try {
    const user = await get('SELECT warnCount FROM warn WHERE jid = ?', [jid]);
    return user ? user.warnCount : 0;
  } catch (error) {
    console.error("Error retrieving warn_count:", error);
    return -1;
  }
}

// Function to reset warn_count to 0 for a specific user
async function resetWarnCountByJID(jid) {
  try {
    const result = await run('UPDATE warn SET warnCount = 0 WHERE jid = ?', [jid]);
    if (result.changes > 0) {
      console.log(`User ${jid} warn_count has been reset to 0.`);
    } else {
      console.log(`User ${jid} not found.`);
    }
  } catch (error) {
    console.error("Error resetting warn_count:", error);
  }
}

module.exports = {
  ajouterUtilisateurAvecWarnCount,
  getWarnCountByJID,
  resetWarnCountByJID,
};
