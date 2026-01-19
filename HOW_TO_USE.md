# How to Use Encrypto27 AI Bot 🤖

## 🎯 Command Prefix

**Default Prefix:** `.` (dot)

You can change it in `set.env`:
```env
PREFIX="!"
```

## 📝 Basic Usage

All commands start with the prefix (default: `.`)

### Examples:
- `.ping` - Test if bot is working
- `.menu` - Show all available commands
- `.help` - Get help (if available)

## 🎮 Common Commands

### General Commands
- `.ping` - Check if bot is alive
- `.menu` - Show command menu
- `.alive` - Bot status
- `.uptime` - Bot uptime
- `.profile` - Your profile info

### Media Commands
- `.sticker` - Convert image to sticker
- `.img` - Image processing
- `.video` - Video processing
- `.yt-search` - Search YouTube
- `.play` - Play YouTube video

### Group Management (Admin Only)
- `.antilink` - Enable/disable anti-link
- `.antibot` - Enable/disable anti-bot
- `.warn` - Warn a user
- `.ban` - Ban a user
- `.unban` - Unban a user
- `.promote` - Promote to admin
- `.demote` - Remove admin

### Games & Fun
- `.devinette` - Riddles game
- `.games` - Game commands
- `.quote` - Random quotes
- `.anime` - Anime-related commands

### Utilities
- `.weather` - Weather info
- `.logo` - Generate logos
- `.fancy` - Fancy text
- `.style` - Text styling

## 🔧 Configuration

### Check Your Prefix

1. Look in `set.js` or `set.env`:
   ```env
   PREFIX="."
   ```

2. Or check the bot's startup message - it shows the prefix

### Change Prefix

1. Edit `set.env`:
   ```env
   PREFIX="!"
   ```

2. Restart the bot

## 📋 See All Commands

Type `.menu` in any chat to see all available commands organized by category.

## 🔐 Permissions

### Public Mode
- If `PUBLIC_MODE=yes` in `set.env`: Everyone can use commands
- If `PUBLIC_MODE=no`: Only super users (owner + sudo) can use commands

### Admin Commands
Some commands require:
- **Group Admin** - For group management commands
- **Super User** - Owner or users in sudo list
- **Owner** - The bot owner (defined in `NUMERO_OWNER`)

## 💡 Tips

1. **Test the bot**: Send `.ping` to check if it's working
2. **Get help**: Send `.menu` to see all commands
3. **Group commands**: Most moderation commands work only in groups
4. **Private messages**: Some commands may be restricted in PM (check `PM_PERMIT` setting)

## 🚨 Troubleshooting

### Bot not responding?
1. Check if bot is online (send `.ping`)
2. Check your prefix (default is `.`)
3. Make sure `PUBLIC_MODE=yes` if you're not the owner
4. Check if you're banned (owner can check)

### Command not found?
1. Make sure you're using the correct prefix
2. Check spelling (commands are case-sensitive)
3. Some commands may be admin-only

---

**Need more help?** Check the command files in `Andbad_cmds/` folder to see what each command does!
