# QR Code Troubleshooting

## If QR Code Doesn't Appear

### Solution 1: Delete Existing Session

If you have an old/invalid session, delete it to force a new QR code:

```bash
# Stop the bot first (Ctrl+C)
rm -rf auth/creds.json
# Or delete the entire auth folder:
rm -rf auth/
mkdir auth
```

Then restart:
```bash
npm start
```

### Solution 2: Check Terminal Output

Look for these messages in your terminal:
- `📱 QR Code generated` - QR code was created
- `🔌 Connection update:` - Connection status updates
- `📱 QR Code updated` - QR code sent to pairing server

If you don't see "QR Code generated", the session might be trying to reconnect automatically.

### Solution 3: Check Browser Console

1. Open `http://localhost:3000`
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for errors or debug messages

### Solution 4: Manual Refresh

- Refresh the browser page (F5)
- The page auto-refreshes every 2 seconds, but manual refresh can help

### Solution 5: Check API Directly

Test if the pairing server is working:
```bash
curl http://localhost:3000/api/status
```

Should return:
```json
{"status":"connecting","connected":false,"hasQR":false,"hasPairingCode":false}
```

If `hasQR` is `true` but you don't see it, it's a frontend issue.
If `hasQR` is `false`, the QR code isn't being generated/captured.

---

## Common Issues

### Issue: "Connecting..." but no QR code

**Cause**: Session file exists but is invalid/expired

**Fix**: Delete `auth/creds.json` and restart

### Issue: Page shows "Waiting for QR code..."

**Cause**: QR code hasn't been generated yet

**Fix**: 
1. Wait a few seconds (QR generates after connection attempt)
2. Check terminal for errors
3. Delete session file if needed

### Issue: QR code appears then disappears

**Cause**: QR code expired (they expire after ~60 seconds)

**Fix**: Wait for a new QR code to be generated automatically

---

*If issues persist, check the terminal output for error messages.*
