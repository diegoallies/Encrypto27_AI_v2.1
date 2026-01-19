# Quick Start - Pairing Website

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

This will install `express` and `qrcode` packages needed for the pairing server.

### Step 2: Start the Bot

```bash
npm start
```

### Step 3: Open Pairing Page

Once the bot starts, you'll see:
```
🌐 Pairing server running on http://localhost:3000
📱 Open http://localhost:3000 in your browser to pair WhatsApp
```

Open `http://localhost:3000` in your browser.

### Step 4: Pair WhatsApp

1. **If you see a QR code:**
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Scan the QR code on the webpage

2. **If you see a pairing code:**
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Tap "Link with Phone Number Instead"
   - Enter the 8-digit code shown on the webpage

### Step 5: Wait for Connection

The page will automatically update when WhatsApp is connected. You'll see a green checkmark ✅ and "Successfully Connected!" message.

## 🎯 That's It!

Your WhatsApp is now paired with the bot. You can close the browser tab - the bot will continue running.

## 🔧 Customization

### Change Port

Add to your `set.env` file:
```env
PAIRING_PORT=3001
```

### Access from Phone

To access the pairing page from your phone:

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows  
   ipconfig
   # Look for IPv4 Address
   ```

2. On your phone's browser, go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

## ❓ Troubleshooting

**Port already in use?**
- Change `PAIRING_PORT` in `set.env` to a different number (e.g., 3001, 8080)

**QR code not showing?**
- Make sure the bot started successfully
- Check the terminal for any errors
- Try refreshing the browser page

**Connection fails?**
- Make sure you're scanning the QR code quickly (it expires in ~60 seconds)
- Check that your phone and computer are on the same network (if using IP address)
- Try deleting `auth/creds.json` and restarting the bot

---

*Enjoy your self-hosted pairing website!* 🎉
