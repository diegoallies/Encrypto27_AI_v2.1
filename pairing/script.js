// Configuration
const API_BASE = '';
const POLL_INTERVAL = 2000; // 2 seconds

// State
let currentQR = null;
let currentPairingCode = null;
let isPolling = true;

// DOM Elements
const statusCard = document.getElementById('statusCard');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const qrSection = document.getElementById('qrSection');
const pairingCodeSection = document.getElementById('pairingCodeSection');
const connectedSection = document.getElementById('connectedSection');
const qrCanvas = document.getElementById('qrCanvas');
const pairingCodeDisplay = document.getElementById('pairingCodeDisplay');
const copyBtn = document.getElementById('copyBtn');

// Initialize
async function init() {
    updateStatus('Initializing...', 'disconnected');
    startPolling();
    setupCopyButton();
}

// Poll for updates
async function startPolling() {
    while (isPolling) {
        try {
            await checkStatus();
            await checkQR();
            await checkPairingCode();
        } catch (error) {
            console.error('Polling error:', error);
        }
        await sleep(POLL_INTERVAL);
    }
}

// Check connection status
async function checkStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/status`);
        const data = await response.json();
        
        if (data.connected) {
            showConnected();
            isPolling = false;
        } else if (data.status === 'connecting') {
            updateStatus('Connecting...', 'connecting');
        } else {
            updateStatus('Waiting for connection...', 'disconnected');
        }
    } catch (error) {
        console.error('Status check error:', error);
    }
}

// Check for QR code
async function checkQR() {
    try {
        const response = await fetch(`${API_BASE}/api/qr`);
        const data = await response.json();
        
        console.log('QR check response:', { hasQR: !!data.qr, status: data.status }); // Debug
        
        if (data.qr && data.qr !== currentQR) {
            currentQR = data.qr;
            await displayQR(data.qr);
            showQRSection();
        } else if (!data.qr && currentQR) {
            // QR code cleared (might be switching to pairing code)
            currentQR = null;
        } else if (!data.qr && !currentQR && data.status === 'connecting') {
            // Still waiting for QR - show loading state
            updateStatus('Waiting for QR code...', 'connecting');
        }
    } catch (error) {
        console.error('QR check error:', error);
    }
}

// Check for pairing code
async function checkPairingCode() {
    try {
        const response = await fetch(`${API_BASE}/api/pairing-code`);
        const data = await response.json();
        
        if (data.code && data.code !== currentPairingCode) {
            currentPairingCode = data.code;
            displayPairingCode(data.code);
            showPairingCodeSection();
        }
    } catch (error) {
        console.error('Pairing code check error:', error);
    }
}

// Display QR code
async function displayQR(qrString) {
    try {
        await QRCode.toCanvas(qrCanvas, qrString, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        updateStatus('Scan QR code with WhatsApp', 'connecting');
    } catch (error) {
        console.error('QR display error:', error);
    }
}

// Display pairing code
function displayPairingCode(code) {
    pairingCodeDisplay.textContent = code;
    updateStatus('Enter pairing code in WhatsApp', 'connecting');
}

// Show QR section
function showQRSection() {
    qrSection.style.display = 'block';
    pairingCodeSection.style.display = 'none';
    connectedSection.style.display = 'none';
}

// Show pairing code section
function showPairingCodeSection() {
    qrSection.style.display = 'none';
    pairingCodeSection.style.display = 'block';
    connectedSection.style.display = 'none';
}

// Show connected section
function showConnected() {
    qrSection.style.display = 'none';
    pairingCodeSection.style.display = 'none';
    connectedSection.style.display = 'block';
    updateStatus('Connected!', 'connected');
}

// Update status
function updateStatus(text, status) {
    statusText.textContent = text;
    statusIndicator.className = 'status-indicator ' + status;
}

// Copy pairing code to clipboard
function setupCopyButton() {
    copyBtn.addEventListener('click', async () => {
        if (currentPairingCode) {
            try {
                await navigator.clipboard.writeText(currentPairingCode);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            } catch (error) {
                console.error('Copy error:', error);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = currentPairingCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy Code';
                }, 2000);
            }
        }
    });
}

// Utility function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start when page loads
document.addEventListener('DOMContentLoaded', init);
