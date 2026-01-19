#!/usr/bin/env node

/**
 * Comprehensive Endpoint Testing Script
 * Tests all API endpoints, database operations, and command loading
 */

const http = require('http');
const path = require('path');
const fs = require('fs-extra');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
    log(`\n🧪 Testing: ${name}`, 'cyan');
}

function logPass(message) {
    log(`  ✅ ${message}`, 'green');
}

function logFail(message) {
    log(`  ❌ ${message}`, 'red');
}

function logWarn(message) {
    log(`  ⚠️  ${message}`, 'yellow');
}

// Test results
const results = {
    passed: 0,
    failed: 0,
    warnings: 0
};

async function testPairingServer() {
    logTest('Pairing Server Endpoints');
    
    const port = process.env.PAIRING_PORT || 3000;
    const baseUrl = `http://localhost:${port}`;
    
    const endpoints = [
        { path: '/', name: 'Main Page' },
        { path: '/api/status', name: 'Status API' },
        { path: '/api/qr', name: 'QR Code API' },
        { path: '/api/qr-image', name: 'QR Image API' },
        { path: '/api/pairing-code', name: 'Pairing Code API' },
        { path: '/style.css', name: 'CSS File' },
        { path: '/script.js', name: 'JavaScript File' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${baseUrl}${endpoint.path}`);
            if (response.ok || response.status === 200) {
                logPass(`${endpoint.name} (${endpoint.path}) - OK`);
                results.passed++;
            } else {
                logFail(`${endpoint.name} (${endpoint.path}) - Status: ${response.status}`);
                results.failed++;
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                logWarn(`${endpoint.name} - Server not running (expected if bot not started)`);
                results.warnings++;
            } else {
                logFail(`${endpoint.name} - Error: ${error.message}`);
                results.failed++;
            }
        }
    }
}

async function testDatabase() {
    logTest('Database Operations');
    
    try {
        const sqliteDb = require('./bdd/sqlite-db');
        
        // Test database exports
        if (sqliteDb.db) {
            logPass('Database connection object - Exists');
            results.passed++;
        } else {
            logFail('Database connection object - Missing');
            results.failed++;
        }
        
        // Test helper functions
        const helpers = ['run', 'get', 'all', 'initTables'];
        for (const helper of helpers) {
            if (typeof sqliteDb[helper] === 'function') {
                logPass(`Helper ${helper}() - Exists`);
                results.passed++;
            } else {
                logFail(`Helper ${helper}() - Missing`);
                results.failed++;
            }
        }
        
        // Test database file exists
        const dbPath = path.join(__dirname, 'database.sqlite');
        if (fs.existsSync(dbPath)) {
            logPass('Database file - Exists');
            results.passed++;
        } else {
            logWarn('Database file - Not created yet (will be created on first run)');
            results.warnings++;
        }
        
        // Test initTables function works
        try {
            await sqliteDb.initTables();
            logPass('Database tables initialization - OK');
            results.passed++;
        } catch (error) {
            logFail(`Database tables initialization - Error: ${error.message}`);
            results.failed++;
        }
        
    } catch (error) {
        logFail(`Database test - Error: ${error.message}`);
        results.failed++;
    }
}

async function testDatabaseModules() {
    logTest('Database Module Imports');
    
    const dbModules = [
        'bdd/antilien',
        'bdd/sudo',
        'bdd/banUser',
        'bdd/banGroup',
        'bdd/warn',
        'bdd/antibot',
        'bdd/onlyAdmin',
        'bdd/level',
        'bdd/welcome',
        'bdd/cron',
        'bdd/mention',
        'bdd/theme',
        'bdd/stickcmd',
        'bdd/alive'
    ];
    
    for (const modulePath of dbModules) {
        try {
            const module = require(`./${modulePath}`);
            if (module && typeof module === 'object') {
                logPass(`${modulePath} - Loads successfully`);
                results.passed++;
            } else {
                logFail(`${modulePath} - Invalid export`);
                results.failed++;
            }
        } catch (error) {
            logFail(`${modulePath} - Error: ${error.message}`);
            results.failed++;
        }
    }
}

async function testCommandLoading() {
    logTest('Command Loading');
    
    try {
        // Load all command files to register them
        const commandsDir = path.join(__dirname, 'Andbad_cmds');
        if (fs.existsSync(commandsDir)) {
            const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
            logPass(`Command files found - ${commandFiles.length} files`);
            results.passed++;
            
            // Try to load a few command files to test they work
            let loadedCount = 0;
            let errorCount = 0;
            for (const file of commandFiles.slice(0, 5)) { // Test first 5
                try {
                    require(path.join(commandsDir, file.replace('.js', '')));
                    loadedCount++;
                } catch (error) {
                    errorCount++;
                    logWarn(`Command file ${file} - Error: ${error.message}`);
                    results.warnings++;
                }
            }
            
            if (loadedCount > 0) {
                logPass(`Command files loaded - ${loadedCount} successful`);
                results.passed++;
            }
            
            if (errorCount > 0) {
                logWarn(`${errorCount} command files had errors`);
                results.warnings++;
            }
        } else {
            logFail('Commands directory - Not found');
            results.failed++;
        }
        
        // Now check the command registry
        const { cm } = require('./framework/zokou');
        
        if (Array.isArray(cm)) {
            if (cm.length > 0) {
                logPass(`Command registry - ${cm.length} commands registered`);
                results.passed++;
            } else {
                logWarn('Command registry - 0 commands (commands load when bot starts)');
                results.warnings++;
            }
            
            // Check for removed commands
            const removedCommands = ['waifu', 'neko', 'shinobu', 'megumin', 'cosplay', 
                                   'couplepp', 'hwaifu', 'trap', 'hneko', 'blowjob', 
                                   'hentaivid', 'nsfw'];
            
            const foundRemoved = cm.filter(cmd => removedCommands.includes(cmd.nomCom));
            if (foundRemoved.length === 0) {
                logPass('Removed commands - Not found (good)');
                results.passed++;
            } else {
                logFail(`Removed commands still present: ${foundRemoved.map(c => c.nomCom).join(', ')}`);
                results.failed++;
            }
            
            // Check for removed categories
            const categories = [...new Set(cm.map(c => c.categorie))];
            if (!categories.includes('Weeb') && !categories.includes('Hentai')) {
                logPass('Removed categories - Not found (good)');
                results.passed++;
            } else {
                logFail(`Removed categories still present: ${categories.filter(c => c === 'Weeb' || c === 'Hentai').join(', ')}`);
                results.failed++;
            }
            
        } else {
            logFail('Command registry - Not an array');
            results.failed++;
        }
    } catch (error) {
        logFail(`Command loading - Error: ${error.message}`);
        results.failed++;
    }
}

async function testFileStructure() {
    logTest('File Structure');
    
    const requiredFiles = [
        'index.js',
        'set.js',
        'pairing-server.js',
        'bdd/sqlite-db.js',
        'framework/zokou.js',
        'pairing/index.html',
        'pairing/style.css',
        'pairing/script.js'
    ];
    
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            logPass(`${file} - Exists`);
            results.passed++;
        } else {
            logFail(`${file} - Missing`);
            results.failed++;
        }
    }
    
    // Check deleted files are actually gone
    const deletedFiles = [
        'Andbad_cmds/weeb.js',
        'Andbad_cmds/hentai.js',
        'bdd/hentai.js'
    ];
    
    for (const file of deletedFiles) {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            logPass(`${file} - Correctly deleted`);
            results.passed++;
        } else {
            logFail(`${file} - Still exists (should be deleted)`);
            results.failed++;
        }
    }
}

async function testDependencies() {
    logTest('Critical Dependencies');
    
    const criticalDeps = [
        '@whiskeysockets/baileys',
        'express',
        'qrcode',
        'sequelize',
        'sqlite3',
        'axios',
        'fs-extra'
    ];
    
    for (const dep of criticalDeps) {
        try {
            require(dep);
            logPass(`${dep} - Installed`);
            results.passed++;
        } catch (error) {
            logFail(`${dep} - Not installed: ${error.message}`);
            results.failed++;
        }
    }
}

async function testPairingServerClass() {
    logTest('Pairing Server Class');
    
    try {
        const PairingServer = require('./pairing-server');
        
        if (typeof PairingServer === 'function') {
            logPass('PairingServer class - Exists');
            results.passed++;
            
            // Test instantiation
            try {
                const server = new PairingServer(3001); // Use different port for testing
                logPass('PairingServer instantiation - OK');
                results.passed++;
                
                // Test methods exist
                const requiredMethods = ['updateQR', 'updatePairingCode', 'updateConnectionStatus', 'start'];
                for (const method of requiredMethods) {
                    if (typeof server[method] === 'function') {
                        logPass(`Method ${method}() - Exists`);
                        results.passed++;
                    } else {
                        logFail(`Method ${method}() - Missing`);
                        results.failed++;
                    }
                }
            } catch (error) {
                logFail(`PairingServer instantiation - Error: ${error.message}`);
                results.failed++;
            }
        } else {
            logFail('PairingServer - Not a class');
            results.failed++;
        }
    } catch (error) {
        logFail(`PairingServer test - Error: ${error.message}`);
        results.failed++;
    }
}

async function runAllTests() {
    log('\n═══════════════════════════════════════════════════════', 'blue');
    log('  COMPREHENSIVE ENDPOINT TESTING', 'blue');
    log('═══════════════════════════════════════════════════════\n', 'blue');
    
    await testFileStructure();
    await testDependencies();
    await testDatabase();
    await testDatabaseModules();
    await testCommandLoading();
    await testPairingServerClass();
    await testPairingServer();
    
    // Summary
    log('\n═══════════════════════════════════════════════════════', 'blue');
    log('  TEST SUMMARY', 'blue');
    log('═══════════════════════════════════════════════════════', 'blue');
    log(`✅ Passed: ${results.passed}`, 'green');
    log(`❌ Failed: ${results.failed}`, 'red');
    log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
    log('═══════════════════════════════════════════════════════\n', 'blue');
    
    if (results.failed === 0) {
        log('🎉 All tests passed!', 'green');
        process.exit(0);
    } else {
        log('⚠️  Some tests failed. Please review the errors above.', 'yellow');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    logFail(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
});
