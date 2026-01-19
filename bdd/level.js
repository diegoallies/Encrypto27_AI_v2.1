const { run, get, all } = require('./sqlite-db');

// Function to add or update user data (XP and messages)
const ajouterOuMettreAJourUserData = async (jid) => {
  try {
    const user = await get('SELECT xp FROM level WHERE jid = ?', [jid]);
    if (user) {
      await run('UPDATE level SET xp = xp + 10, lastMessageTime = ? WHERE jid = ?', [Date.now(), jid]);
    } else {
      await run('INSERT INTO level (jid, xp, level, lastMessageTime) VALUES (?, 10, 1, ?)', [jid, Date.now()]);
    }
    console.log(`✅ User ${jid} data updated or added.`);
  } catch (error) {
    console.error("❌ Error updating or adding user data:", error);
  }
};

// Function to get the number of messages and XP for a given JID
const getMessagesAndXPByJID = async (jid) => {
  try {
    const user = await get('SELECT xp FROM level WHERE jid = ?', [jid]);
    if (user) {
      return { messages: Math.floor(user.xp / 10), xp: user.xp };
    } else {
      return { messages: 0, xp: 0 };
    }
  } catch (error) {
    console.error("❌ Error retrieving user data:", error);
    return { messages: 0, xp: 0 };
  }
};

// Function to get the bottom 10 users (by XP)
const getBottom10Users = async () => {
  try {
    const users = await all('SELECT jid, xp FROM level ORDER BY xp DESC LIMIT 10');
    return users.map(user => ({ jid: user.jid, xp: user.xp, messages: Math.floor(user.xp / 10) }));
  } catch (error) {
    console.error("❌ Error retrieving bottom 10 users:", error);
    return [];
  }
};

module.exports = {
  ajouterOuMettreAJourUserData,
  getMessagesAndXPByJID,
  getBottom10Users,
};
