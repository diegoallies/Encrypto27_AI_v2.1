const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs-extra');

class PairingServer {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.qrCode = null;
        this.pairingCode = null;
        this.isConnected = false;
        this.connectionStatus = 'disconnected'; // disconnected, connecting, connected
        
        this.setupRoutes();
    }

    setupRoutes() {
        // Serve static files
        this.app.use(express.static(path.join(__dirname, 'pairing')));
        
        // API endpoint to get QR code
        this.app.get('/api/qr', (req, res) => {
            if (this.qrCode) {
                res.json({ 
                    qr: this.qrCode,
                    status: this.connectionStatus,
                    connected: this.isConnected
                });
            } else {
                res.json({ 
                    qr: null,
                    status: this.connectionStatus,
                    connected: this.isConnected,
                    message: 'Waiting for QR code...'
                });
            }
        });

        // API endpoint to get pairing code
        this.app.get('/api/pairing-code', (req, res) => {
            if (this.pairingCode) {
                res.json({ 
                    code: this.pairingCode,
                    status: this.connectionStatus,
                    connected: this.isConnected
                });
            } else {
                res.json({ 
                    code: null,
                    status: this.connectionStatus,
                    connected: this.isConnected,
                    message: 'No pairing code available'
                });
            }
        });

        // API endpoint to get connection status
        this.app.get('/api/status', (req, res) => {
            res.json({
                status: this.connectionStatus,
                connected: this.isConnected,
                hasQR: !!this.qrCode,
                hasPairingCode: !!this.pairingCode
            });
        });

        // Serve main page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'pairing', 'index.html'));
        });
    }

    // Update QR code
    async updateQR(qrString) {
        try {
            this.qrCode = qrString;
            this.connectionStatus = 'connecting';
            this.isConnected = false;
            console.log('📱 QR Code updated');
        } catch (error) {
            console.error('Error updating QR:', error);
        }
    }

    // Update pairing code
    updatePairingCode(code) {
        this.pairingCode = code;
        this.connectionStatus = 'connecting';
        this.isConnected = false;
        console.log('🔢 Pairing Code:', code);
    }

    // Update connection status
    updateConnectionStatus(status, connected = false) {
        this.connectionStatus = status;
        this.isConnected = connected;
        if (connected) {
            this.qrCode = null;
            this.pairingCode = null;
            console.log('✅ WhatsApp Connected!');
        }
    }

    // Start the server
    start() {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`\n🌐 Pairing server running on http://localhost:${this.port}`);
                    console.log(`📱 Open http://localhost:${this.port} in your browser to pair WhatsApp\n`);
                    resolve();
                }
            });
        });
    }

    // Stop the server
    stop() {
        // Server doesn't have a built-in stop method, but we can track it
        console.log('Pairing server stopped');
    }
}

module.exports = PairingServer;
