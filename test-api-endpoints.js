#!/usr/bin/env node

/**
 * Test All API Endpoints Used in Commands
 * Tests each external API to ensure they're still working
 */

const axios = require('axios');
// Use built-in fetch (Node 18+) or axios as fallback
const fetch = globalThis.fetch || ((url, options) => {
    return axios(url, options).then(res => ({
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        json: () => Promise.resolve(res.data),
        text: () => Promise.resolve(JSON.stringify(res.data))
    }));
});

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

const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    broken: []
};

// Test an API endpoint
async function testAPI(name, url, options = {}) {
    try {
        const timeout = options.timeout || 10000;
        const method = options.method || 'GET';
        const headers = options.headers || {};
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        let response;
        if (method === 'GET') {
            response = await fetch(url, { 
                method: 'GET',
                headers,
                signal: controller.signal 
            });
        } else {
            response = await fetch(url, {
                method,
                headers,
                body: options.body,
                signal: controller.signal
            });
        }
        
        clearTimeout(timeoutId);
        
        if (response.ok || response.status === 200) {
            // Try to parse JSON if possible
            try {
                const data = await response.json();
                logPass(`${name} - OK (Status: ${response.status})`);
                results.passed++;
                return { success: true, data };
            } catch (e) {
                // Not JSON, but response is OK
                logPass(`${name} - OK (Status: ${response.status}, Non-JSON)`);
                results.passed++;
                return { success: true };
            }
        } else {
            logFail(`${name} - Failed (Status: ${response.status})`);
            results.failed++;
            results.broken.push({ name, url, reason: `HTTP ${response.status}` });
            return { success: false, status: response.status };
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            logFail(`${name} - Timeout (>${options.timeout || 10000}ms)`);
            results.failed++;
            results.broken.push({ name, url, reason: 'Timeout' });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            logFail(`${name} - Connection failed (${error.message})`);
            results.failed++;
            results.broken.push({ name, url, reason: error.message });
        } else {
            logFail(`${name} - Error: ${error.message}`);
            results.failed++;
            results.broken.push({ name, url, reason: error.message });
        }
        return { success: false, error: error.message };
    }
}

async function testAllAPIs() {
    log('\n═══════════════════════════════════════════════════════', 'blue');
    log('  API ENDPOINT TESTING', 'blue');
    log('═══════════════════════════════════════════════════════\n', 'blue');
    
    // Test APIs from Answer.js
    logTest('Answer.js Commands');
    
    await testAPI('insult', 'https://api.maher-zubair.tech/misc/insult');
    await testAPI('lines', 'https://api.maher-zubair.tech/misc/lines');
    await testAPI('calc', 'https://api.maher-zubair.tech/ai/mathssolve?q=2+2');
    await testAPI('technews', 'https://fantox001-scrappy-api.vercel.app/technews/random');
    await testAPI('number validation', 'https://tajammalmods.xyz/Validater.php?num=1234567890');
    await testAPI('pair', 'https://andbad-qr-k71b.onrender.com/pair?number=1234567890');
    await testAPI('gpt2', 'http://api.brainshop.ai/get?bid=181821&key=ltFzFIXrtj2SVMTX&uid=test&msg=hello');
    await testAPI('gpt', 'https://api.gurusensei.workers.dev/llama?prompt=hello');
    await testAPI('gemini', 'https://widipe.com/gemini?text=hello');
    await testAPI('dalle', 'https://widipe.com/dalle?text=cat');
    await testAPI('time', 'https://levanter.onrender.com/time?code=US');
    await testAPI('enhance', 'https://api.maher-zubair.tech/maker/enhance?url=https://example.com/image.jpg');
    await testAPI('dare', 'https://shizoapi.onrender.com/api/texts/dare?apikey=shizo');
    await testAPI('truth', 'https://shizoapi.onrender.com/api/texts/truth?apikey=shizo');
    await testAPI('applenews', 'https://api.maher-zubair.tech/details/ios');
    await testAPI('nasanews', 'https://api.maher-zubair.tech/details/nasa');
    await testAPI('population', 'https://api.maher-zubair.tech/details/population');
    await testAPI('jokes', 'https://api.popcat.xyz/joke');
    await testAPI('advice', 'https://api.adviceslip.com/advice');
    await testAPI('trivia', 'https://opentdb.com/api.php?amount=1&type=multiple');
    await testAPI('inspire', 'https://type.fit/api/quotes');
    await testAPI('gpt4', 'https://samirxpikachuio.onrender.com/gpt?content=hello');
    await testAPI('bard', 'https://api.guruapi.tech/ai/gpt4?username=test&query=hello');
    await testAPI('best-wallp', 'https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
    await testAPI('random', 'https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
    await testAPI('nature', 'https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
    
    // Test other command files
    logTest('Other Commands');
    
    // Check yt-search.js
    await testAPI('yt-search', 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=test', { timeout: 5000 });
    
    // Check weather.js
    await testAPI('weather', 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=test', { timeout: 5000 });
    
    // Check igdl-fb-tk.js
    await testAPI('instagram downloader', 'https://api.maher-zubair.tech/download/instagram?url=https://www.instagram.com/p/test/', { timeout: 5000 });
    await testAPI('facebook downloader', 'https://api.maher-zubair.tech/download/facebook?url=https://www.facebook.com/test', { timeout: 5000 });
    await testAPI('tiktok downloader', 'https://api.maher-zubair.tech/download/tiktok?url=https://www.tiktok.com/test', { timeout: 5000 });
    
    // Summary
    log('\n═══════════════════════════════════════════════════════', 'blue');
    log('  TEST SUMMARY', 'blue');
    log('═══════════════════════════════════════════════════════', 'blue');
    log(`✅ Passed: ${results.passed}`, 'green');
    log(`❌ Failed: ${results.failed}`, 'red');
    log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
    log('═══════════════════════════════════════════════════════\n', 'blue');
    
    if (results.broken.length > 0) {
        log('🔴 BROKEN APIs:', 'red');
        results.broken.forEach(({ name, url, reason }) => {
            log(`  - ${name}: ${url}`, 'red');
            log(`    Reason: ${reason}`, 'yellow');
        });
    }
    
    if (results.failed === 0) {
        log('🎉 All APIs working!', 'green');
        process.exit(0);
    } else {
        log(`⚠️  ${results.failed} API(s) need fixing.`, 'yellow');
        process.exit(1);
    }
}

// Run tests
testAllAPIs().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
