const { run, get, all } = require('./sqlite-db');

// Function to add a stick command
const addStickCmd = async (cmd, id) => {
  try {
    const existing = await get('SELECT cmd FROM stickcmd WHERE cmd = ?', [cmd]);
    if (existing) {
      console.log(`Command ${cmd} already exists.`);
      return;
    }
    await run('INSERT INTO stickcmd (cmd, id) VALUES (?, ?)', [cmd, id]);
    console.log(`Command ${cmd} added successfully.`);
  } catch (error) {
    console.error("❌ Error adding stickcmd:", error);
  }
};

// Function to check if a stick command exists by ID
const inStickCmd = async (id) => {
  try {
    const cmd = await get('SELECT id FROM stickcmd WHERE id = ?', [id]);
    return cmd !== null;
  } catch (error) {
    console.error("❌ Error checking stickcmd:", error);
    return false;
  }
};

// Function to delete a stick command by cmd
const deleteCmd = async (cmd) => {
  try {
    const result = await run('DELETE FROM stickcmd WHERE cmd = ?', [cmd]);
    if (result.changes > 0) {
      console.log(`Command ${cmd} deleted successfully.`);
    } else {
      console.log(`No command ${cmd} found.`);
    }
  } catch (error) {
    console.error("❌ Error deleting stickcmd:", error);
  }
};

// Function to get a stick command by ID
const getCmdById = async (id) => {
  try {
    const cmd = await get('SELECT cmd FROM stickcmd WHERE id = ?', [id]);
    return cmd ? cmd.cmd : null;
  } catch (error) {
    console.error("❌ Error retrieving stickcmd by id:", error);
    return null;
  }
};

// Function to get all stick commands
const getAllStickCmds = async () => {
  try {
    return await all('SELECT * FROM stickcmd');
  } catch (error) {
    console.error("❌ Error retrieving all stickcmd commands:", error);
    return [];
  }
};

module.exports = {
  addStickCmd,
  deleteCmd,
  getCmdById,
  inStickCmd,
  getAllStickCmds,
};
