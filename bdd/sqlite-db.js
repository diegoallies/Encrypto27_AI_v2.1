const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

const DB_PATH = path.join(__dirname, '../database.sqlite');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ SQLite connection error:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Helper function to run queries
const run = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

// Helper function to get one row
const get = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Helper function to get all rows
const all = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Initialize all tables
const initTables = async () => {
    const tables = [
        // Antilien table
        `CREATE TABLE IF NOT EXISTS antilien (
            jid TEXT PRIMARY KEY,
            etat TEXT DEFAULT 'non',
            action TEXT DEFAULT 'supp'
        )`,
        
        // Antibot table
        `CREATE TABLE IF NOT EXISTS antibot (
            jid TEXT PRIMARY KEY,
            etat TEXT DEFAULT 'non',
            action TEXT DEFAULT 'supp'
        )`,
        
        // Sudo table
        `CREATE TABLE IF NOT EXISTS sudo (
            jid TEXT PRIMARY KEY
        )`,
        
        // BanUser table
        `CREATE TABLE IF NOT EXISTS banUser (
            jid TEXT PRIMARY KEY
        )`,
        
        // BanGroup table (using jid to match banUser structure)
        `CREATE TABLE IF NOT EXISTS banGroup (
            jid TEXT PRIMARY KEY
        )`,
        
        // OnlyAdmin table
        `CREATE TABLE IF NOT EXISTS onlyAdmin (
            jid TEXT PRIMARY KEY
        )`,
        
        // Warn table
        `CREATE TABLE IF NOT EXISTS warn (
            jid TEXT PRIMARY KEY,
            warnCount INTEGER DEFAULT 0
        )`,
        
        // Level table
        `CREATE TABLE IF NOT EXISTS level (
            jid TEXT PRIMARY KEY,
            xp INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            lastMessageTime INTEGER
        )`,
        
        // Welcome table
        `CREATE TABLE IF NOT EXISTS welcome (
            group_id TEXT PRIMARY KEY,
            welcome TEXT DEFAULT 'off',
            goodbye TEXT DEFAULT 'off',
            antipromote TEXT DEFAULT 'off',
            antidemote TEXT DEFAULT 'off'
        )`,
        
        // Cron table
        `CREATE TABLE IF NOT EXISTS cron (
            group_id TEXT PRIMARY KEY,
            mute_at TEXT,
            unmute_at TEXT
        )`,
        
        // Mention table
        `CREATE TABLE IF NOT EXISTS mention (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            status TEXT DEFAULT 'non',
            type TEXT DEFAULT 'text',
            message TEXT,
            url TEXT
        )`,
        
        // Theme table
        `CREATE TABLE IF NOT EXISTS theme (
            jid TEXT PRIMARY KEY,
            theme TEXT
        )`,
        
        // Stickcmd table
        `CREATE TABLE IF NOT EXISTS stickcmd (
            cmd TEXT PRIMARY KEY,
            id TEXT NOT NULL
        )`,
        
        // Hentai table removed - inappropriate content
        
        // Alive table
        `CREATE TABLE IF NOT EXISTS alive (
            id INTEGER PRIMARY KEY DEFAULT 1,
            message TEXT,
            lien TEXT
        )`
    ];
    
    for (const table of tables) {
        await run(table);
    }
};

// Initialize on load
initTables().catch(err => {
    console.error('❌ Error initializing SQLite tables:', err);
});

module.exports = {
    db,
    run,
    get,
    all,
    initTables
};
