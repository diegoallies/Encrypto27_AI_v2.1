const fs = require('fs-extra');
const mongoose = require('mongoose');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");

// MongoDB URI (replace with your MongoDB URI or environment variable)
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/my_database';

// Connection setup for MongoDB
mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

module.exports = {
    session: process.env.SESSION_ID || '',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT: process.env.BOT_NAME || 'BMW_MD',
    URL: process.env.BOT_MENU_LINKS || 'https://i.ibb.co/Q9yd9tR/IMG-20250117-WA0097.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '',
    CHATBOT: process.env.PM_CHATBOT || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    ADM: process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL: process.env.MONGO_URI , // MongoDB URL
    DATABASE: DATABASE_URL.startsWith('mongodb')
        ? "mongodb://localhost:27017/my_database"
        : DATABASE_URL, // Handle if it's MongoDB or not
    PAIRING_PORT: process.env.PAIRING_PORT || 3000, // Pairing server port
};

// Watch the file for changes (reloading on changes)
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`File updated: ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
