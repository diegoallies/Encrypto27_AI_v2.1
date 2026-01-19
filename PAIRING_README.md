# WhatsApp Pairing Website

This is your own self-hosted pairing website for the Encrypto27 AI WhatsApp bot.

## Features

- 🌐 **Web-based QR Code Display** - Scan QR code directly from your browser
- 🔢 **Pairing Code Support** - Enter numeric pairing code when QR isn't available
- 📱 **Real-time Updates** - Automatically refreshes connection status
- 🎨 **Modern UI** - Beautiful, responsive interface
- ✅ **Connection Status** - Visual indicators for connection state

## How It Works

1. **Start the Bot**: When you run `npm start`, the pairing server automatically starts
2. **Open Browser**: Navigate to `http://localhost:3000` (or your configured port)
3. **Pair WhatsApp**: 
   - If QR code appears: Scan it with WhatsApp (Settings → Linked Devices)
   - If pairing code appears: Enter the 8-digit code in WhatsApp
4. **Connected**: Once paired, the page shows a success message

## Configuration

### Port Configuration

By default, the pairing server runs on port **3000**. You can change this by setting an environment variable:

```bash
# In your set.env file or environment
PAIRING_PORT=3000
```

### Accessing from Other Devices

If you want to access the pairing page from other devices on your network:

1. Find your computer's local IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Access from another device using: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

### Production Deployment

For production (e.g., Render, Heroku, etc.):

1. The pairing server will automatically start with your bot
2. Make sure your hosting platform allows HTTP traffic on the configured port
3. The pairing page will be accessible at: `https://your-domain.com:PORT`

## API Endpoints

The pairing server exposes these API endpoints:

- `GET /` - Main pairing page (HTML)
- `GET /api/qr` - Get current QR code (JSON)
- `GET /api/pairing-code` - Get current pairing code (JSON)
- `GET /api/status` - Get connection status (JSON)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it:

```bash
export PAIRING_PORT=3001
# or add to set.env: PAIRING_PORT=3001
```

### QR Code Not Appearing

1. Make sure the bot is starting correctly
2. Check browser console for errors
3. Verify the pairing server started (look for "Pairing server running" message)
4. Try refreshing the page

### Connection Issues

- If QR code expires, it will automatically refresh
- If connection fails, check bot logs for errors
- Make sure `auth/` folder has write permissions

## Files Structure

```
pairing/
├── index.html    # Main pairing page
├── style.css     # Styling
└── script.js     # Frontend logic

pairing-server.js # Express server for pairing
```

## Security Notes

⚠️ **Important**: The pairing server is designed for local/trusted network use. For production:

1. Add authentication if exposing publicly
2. Use HTTPS in production
3. Consider rate limiting
4. Add CORS restrictions if needed

## Updating

The pairing page automatically polls the server every 2 seconds for updates. No manual refresh needed!

---

*Created for Encrypto27 AI Bot*
