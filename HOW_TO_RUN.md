# How to Run the Server and Pairing Site

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

First, make sure you have all the required packages installed:

```bash
npm install
```

This will install `express` and `qrcode` (and any other missing dependencies).

### Step 2: Start the Bot

The pairing server **automatically starts** when you start the bot:

```bash
npm start
```

**OR** if you prefer:

```bash
node index.js
```

### Step 3: Open the Pairing Website

Once the bot starts, you'll see a message like:

```
🌐 Pairing server running on http://localhost:3000
📱 Open http://localhost:3000 in your browser to pair WhatsApp
```

**Open your browser and go to:** `http://localhost:3000`

That's it! The pairing website is now running! 🎉

---

## 📱 What You'll See

When you open `http://localhost:3000`, you'll see:

1. **QR Code** (if available) - Scan with WhatsApp
2. **OR Pairing Code** (8-digit number) - Enter in WhatsApp
3. **Connection Status** - Shows if connected or connecting

The page **automatically refreshes** every 2 seconds, so you don't need to reload manually.

---

## 🔧 Alternative: Run on Different Port

If port 3000 is already in use, you can change it:

### Option 1: Environment Variable

```bash
PAIRING_PORT=3001 npm start
```

### Option 2: Add to `set.env` file

Add this line to your `set.env`:

```env
PAIRING_PORT=3001
```

Then start normally:

```bash
npm start
```

---

## 📲 Access from Your Phone

To scan the QR code with your phone, you need to access the pairing page from your phone's browser:

### Step 1: Find Your Computer's IP Address

**On Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

### Step 2: Open on Your Phone

On your phone's browser, go to:
```
http://YOUR_IP_ADDRESS:3000
```

Example: `http://192.168.1.100:3000`

**Important:** Make sure your phone and computer are on the **same WiFi network**.

---

## ✅ Verification

After starting, you should see in the terminal:

```
✅ Connected to MongoDB (if using MongoDB)
🌐 Pairing server running on http://localhost:3000
📱 Open http://localhost:3000 in your browser to pair WhatsApp
ℹ️ KYPHER_XMD CONNECTING...
📱 QR Code generated
```

If you see errors, check the troubleshooting section below.

---

## ❓ Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Use a different port
PAIRING_PORT=3001 npm start
```

### Can't Access from Phone

**Problem:** Can't open `http://YOUR_IP:3000` on phone

**Solutions:**
1. Make sure phone and computer are on same WiFi
2. Check firewall - allow port 3000
3. Try using your computer's localhost and scan QR from phone's WhatsApp directly

### QR Code Not Showing

**Problem:** Page loads but no QR code appears

**Solutions:**
1. Check terminal for errors
2. Make sure bot is starting correctly
3. Wait a few seconds - QR code generates after connection attempt
4. Try refreshing the browser page
5. Check browser console (F12) for JavaScript errors

### Module Not Found Error

**Error:** `Cannot find module 'express'` or `Cannot find module 'qrcode'`

**Solution:**
```bash
npm install express qrcode
```

---

## 🎯 Summary

**One command to rule them all:**

```bash
npm install && npm start
```

Then open: `http://localhost:3000`

The pairing server runs **automatically** - no separate command needed! 🚀
