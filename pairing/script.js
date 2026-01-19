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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Initialize
async function init() {
    console.log('Initializing pairing page...');
    console.log('Canvas element:', qrCanvas);
    
    updateStatus('Initializing...', 'disconnected');
    
    // Make sure QR section is visible initially
    qrSection.style.display = 'block';
    
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
        // Try to get QR code as image first (server-generated)
        const response = await fetch(`${API_BASE}/api/qr-image`);
        const data = await response.json();
        
        console.log('QR check response:', { 
            hasImage: !!data.image, 
            status: data.status 
        });
        
        if (data.image && data.image !== currentQR) {
            console.log('New QR code image detected, displaying...');
            currentQR = data.image;
            displayQRImage(data.image);
            showQRSection();
        } else if (!data.image && currentQR) {
            // QR code cleared (might be switching to pairing code)
            console.log('QR code cleared');
            currentQR = null;
            qrSection.style.display = 'none';
        } else if (!data.image && !currentQR && data.status === 'connecting') {
            // Still waiting for QR - show loading state
            updateStatus('Waiting for QR code...', 'connecting');
        }
    } catch (error) {
        console.error('QR check error:', error);
    }
}

// Display QR code from image data URL
function displayQRImage(imageDataUrl) {
    try {
        console.log('=== Displaying QR Code Image ===');
        console.log('Image data URL length:', imageDataUrl.length);
        console.log('Image data URL preview:', imageDataUrl.substring(0, 50) + '...');
        
        if (!qrCanvas) {
            console.error('❌ Canvas element not found!');
            return;
        }
        
        console.log('✅ Canvas element found');
        const ctx = qrCanvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            console.log('✅ Image loaded successfully');
            console.log('Image dimensions:', img.width, 'x', img.height);
            
            // Set canvas size to match image
            qrCanvas.width = img.width;
            qrCanvas.height = img.height;
            
            console.log('Canvas dimensions set to:', qrCanvas.width, 'x', qrCanvas.height);
            
            // Clear canvas first
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0);
            
            console.log('✅ QR code image drawn to canvas');
            console.log('Canvas style:', window.getComputedStyle(qrCanvas).display);
            console.log('Canvas visibility:', window.getComputedStyle(qrCanvas).visibility);
            
            updateStatus('Scan QR code with WhatsApp', 'connecting');
            showQRSection();
            
            // Force visibility
            qrCanvas.style.display = 'block';
            qrCanvas.style.visibility = 'visible';
            qrCanvas.style.opacity = '1';
            
            console.log('=== QR Code Display Complete ===');
        };
        
        img.onerror = function(error) {
            console.error('❌ Failed to load QR code image');
            console.error('Error details:', error);
            updateStatus('Error loading QR code image', 'disconnected');
        };
        
        console.log('Setting image source...');
        img.src = imageDataUrl;
    } catch (error) {
        console.error('QR image display error:', error);
        console.error('Error stack:', error.stack);
        updateStatus('Error displaying QR code: ' + error.message, 'disconnected');
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
        console.log('=== Displaying QR Code ===');
        console.log('QR string length:', qrString.length);
        console.log('QR string type:', typeof qrString);
        console.log('QR string preview:', qrString.substring(0, 100) + '...');
        
        // Make sure QRCode library is loaded
        if (typeof QRCode === 'undefined') {
            console.error('❌ QRCode library not loaded!');
            console.error('Available globals:', Object.keys(window).filter(k => k.includes('QR')));
            updateStatus('Error: QRCode library not loaded. Please refresh the page.', 'disconnected');
            return;
        }
        
        console.log('✅ QRCode library loaded:', typeof QRCode);
        console.log('QRCode methods:', Object.keys(QRCode));
        
        // Make sure canvas exists
        if (!qrCanvas) {
            console.error('❌ Canvas element not found!');
            return;
        }
        
        console.log('✅ Canvas element found');
        console.log('Canvas before:', { width: qrCanvas.width, height: qrCanvas.height });
        
        // Set canvas size explicitly
        qrCanvas.width = 300;
        qrCanvas.height = 300;
        
        console.log('Canvas after setting size:', { width: qrCanvas.width, height: qrCanvas.height });
        
        // Clear canvas first
        const ctx = qrCanvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
        
        console.log('✅ Canvas cleared and filled with white');
        console.log('Attempting to generate QR code...');
        
        // Generate QR code - Baileys QR format should work directly
        await QRCode.toCanvas(qrCanvas, qrString, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        });
        
        console.log('✅ QR code generated successfully!');
        console.log('Final canvas dimensions:', qrCanvas.width, 'x', qrCanvas.height);
        console.log('Canvas style:', window.getComputedStyle(qrCanvas).display);
        
        // Verify canvas has content
        const imageData = ctx.getImageData(0, 0, 10, 10);
        const hasContent = Array.from(imageData.data).some(pixel => pixel !== 255);
        console.log('Canvas has content:', hasContent);
        
        updateStatus('Scan QR code with WhatsApp', 'connecting');
        
        // Make sure QR section is visible
        showQRSection();
        
        // Force a repaint
        qrCanvas.style.display = 'block';
        qrCanvas.style.visibility = 'visible';
        
        console.log('=== QR Code Display Complete ===');
    } catch (error) {
        console.error('❌ QR display error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        updateStatus('Error displaying QR code: ' + error.message, 'disconnected');
        
        // Try alternative: create image from data URL
        try {
            console.log('Attempting alternative QR code generation...');
            const qrDataUrl = await QRCode.toDataURL(qrString, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            console.log('QR Data URL generated, length:', qrDataUrl.length);
            
            // Create img element and draw to canvas
            const img = new Image();
            img.onload = () => {
                const ctx = qrCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                console.log('✅ QR code displayed via image method');
            };
            img.src = qrDataUrl;
        } catch (altError) {
            console.error('Alternative method also failed:', altError);
        }
    }
}

// Display pairing code
function displayPairingCode(code) {
    pairingCodeDisplay.textContent = code;
    updateStatus('Enter pairing code in WhatsApp', 'connecting');
}

// Show QR section
function showQRSection() {
    console.log('Showing QR section');
    qrSection.style.display = 'block';
    pairingCodeSection.style.display = 'none';
    connectedSection.style.display = 'none';
    
    // Force canvas to be visible
    qrCanvas.style.display = 'block';
    qrCanvas.style.visibility = 'visible';
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
