const { run, get } = require('./sqlite-db');

// Fonction pour attribuer une valeur à une colonne spécifiée
async function attribuerUnevaleur(jid, row, valeur) {
  try {
    const event = await get('SELECT * FROM welcome WHERE group_id = ?', [jid]);
    if (event) {
      await run(`UPDATE welcome SET ${row} = ? WHERE group_id = ?`, [valeur, jid]);
      console.log(`Column ${row} has been updated to ${valeur} for jid ${jid}`);
    } else {
      const defaults = { welcome: 'off', goodbye: 'off', antipromote: 'off', antidemote: 'off' };
      defaults[row] = valeur;
      await run('INSERT INTO welcome (group_id, welcome, goodbye, antipromote, antidemote) VALUES (?, ?, ?, ?, ?)',
        [jid, defaults.welcome, defaults.goodbye, defaults.antipromote, defaults.antidemote]);
      console.log(`New jid ${jid} added with column ${row} set to ${valeur}`);
    }
  } catch (error) {
    console.error("Error updating events:", error);
  }
}

// Fonction pour récupérer la valeur d'une colonne spécifiée
async function recupevents(jid, row) {
  try {
    const event = await get(`SELECT ${row} FROM welcome WHERE group_id = ?`, [jid]);
    if (event) {
      return event[row] || 'off';
    } else {
      return 'off';
    }
  } catch (error) {
    console.error("Error retrieving event:", error);
    return 'off';
  }
}

module.exports = {
  attribuerUnevaleur,
  recupevents,
};
