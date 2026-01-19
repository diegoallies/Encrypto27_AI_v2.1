const { run, get, all } = require('./sqlite-db');

// Function to add a sudo number
const addSudoNumber = async (jid) => {
  try {
    const existing = await get('SELECT jid FROM sudo WHERE jid = ?', [jid]);
    if (existing) {
      console.log(`Number ${jid} is already authorized.`);
      return;
    }
    await run('INSERT INTO sudo (jid) VALUES (?)', [jid]);
    console.log(`Number ${jid} added to the authorized numbers list.`);
  } catch (error) {
    console.error("❌ Error adding authorized phone number:", error);
  }
};

// Function to check if a sudo number exists
const issudo = async (jid) => {
  try {
    const sudo = await get('SELECT jid FROM sudo WHERE jid = ?', [jid]);
    return sudo !== null;
  } catch (error) {
    console.error("❌ Error checking authorized number:", error);
    return false;
  }
};

// Function to remove a sudo number
const removeSudoNumber = async (jid) => {
  try {
    const result = await run('DELETE FROM sudo WHERE jid = ?', [jid]);
    if (result.changes > 0) {
      console.log(`Number ${jid} removed from the authorized numbers list.`);
    } else {
      console.log(`Number ${jid} not found.`);
    }
  } catch (error) {
    console.error("❌ Error removing authorized phone number:", error);
  }
};

// Function to get all sudo numbers
const getAllSudoNumbers = async () => {
  try {
    const sudoNumbers = await all('SELECT jid FROM sudo');
    return sudoNumbers.map(sudo => sudo.jid);
  } catch (error) {
    console.error("❌ Error retrieving authorized numbers:", error);
    return [];
  }
};

// Function to check if the sudo table is empty
const isSudoTableNotEmpty = async () => {
  try {
    const result = await get('SELECT COUNT(*) as count FROM sudo');
    return result && result.count > 0;
  } catch (error) {
    console.error("❌ Error checking 'sudo' table:", error);
    return false;
  }
};

module.exports = {
  addSudoNumber,
  issudo,
  removeSudoNumber,
  getAllSudoNumbers,
  isSudoTableNotEmpty,
};
