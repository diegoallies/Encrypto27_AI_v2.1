# Encrypto27 AI Bot - Architecture Overview

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Command System](#command-system)
5. [Database Structure](#database-structure)
6. [Key Features](#key-features)
7. [Configuration](#configuration)
8. [How It Works](#how-it-works)

---

## Project Overview

**Encrypto27 AI** is a WhatsApp bot built using:
- **Baileys** - WhatsApp Web API library for Node.js
- **MongoDB** - Database for storing bot data
- **Node.js** - Runtime environment

The bot provides various commands for group management, media processing, games, and utilities.

---

## Architecture

### High-Level Structure

```
Encrypto27_AI_v2.1/
├── index.js              # Main entry point - Bot initialization & event handling
├── set.js                # Configuration loader (reads from set.env)
├── framework/            # Core framework files
│   ├── zokou.js         # Command registration system
│   ├── app.js           # Helper functions (reactions, etc.)
│   └── mesfonctions.js  # Utility functions
├── Andbad_cmds/         # All bot commands
├── bdd/                 # Database models & functions
├── auth/                # WhatsApp session storage
└── media/               # Media files (images, GIFs)
```

---

## Core Components

### 1. **index.js** - Main Bot File

This is the heart of the bot. It handles:

#### **Authentication**
- Loads WhatsApp session from `auth/creds.json`
- Handles QR code generation for pairing
- Manages session persistence

#### **Message Processing**
- Listens to all incoming messages via `messages.upsert` event
- Extracts message content (text, images, videos, etc.)
- Identifies command prefix (default: `.`)
- Determines if message is from group or private chat
- Checks user permissions (admin, superUser, dev)

#### **Command Execution**
- Finds matching command in registered commands
- Validates permissions (banned users, group bans, admin-only mode)
- Executes command function with context

#### **Security Features**
- **Anti-Link**: Detects and removes links in groups
- **Anti-Bot**: Detects bot messages and removes them
- **Anti-Delete**: Tracks deleted messages
- **Ban System**: User and group ban management

#### **Group Management**
- Welcome/Goodbye messages
- Anti-promote/demote protection
- Auto-mute/unmute scheduling (cron jobs)

---

### 2. **framework/zokou.js** - Command Registry

This is the command registration system:

```javascript
// How commands are registered
zokou({ 
  nomCom: "commandname",  // Command name
  categorie: "General",    // Category
  reaction: "➕"           // Emoji reaction
}, async (dest, zk, commandeOptions) => {
  // Command function
});
```

**Key Functions:**
- `zokou()` - Registers a new command
- `cm` - Array containing all registered commands

---

### 3. **set.js** - Configuration Manager

Loads configuration from `set.env` file:

**Key Settings:**
- `SESSION_ID` - WhatsApp session (base64 encoded)
- `PREFIX` - Command prefix (default: `.`)
- `PUBLIC_MODE` - `yes`/`no` - Controls if bot accepts commands from everyone
- `NUMERO_OWNER` - Owner's phone number
- `MONGO_URI` - MongoDB connection string
- `AUTO_READ_STATUS` - Auto-read status updates
- `ANTI_DELETE_MESSAGE` - Enable/disable anti-delete feature
- `WARN_COUNT` - Maximum warnings before auto-remove

---

## Command System

### How Commands Work

1. **Command Registration**: Each command file in `Andbad_cmds/` uses `zokou()` to register itself
2. **Command Discovery**: On bot startup, all `.js` files in `Andbad_cmds/` are loaded
3. **Command Matching**: When a message starts with prefix (`.`), bot searches for matching command
4. **Execution**: Command function receives:
   - `dest` - Destination JID (chat ID)
   - `zk` - Baileys socket instance
   - `commandeOptions` - Context object with:
     - `ms` - Message object
     - `repondre` - Function to reply
     - `arg` - Command arguments
     - `auteurMessage` - Sender JID
     - `verifGroupe` - Is group chat?
     - `verifAdmin` - Is sender admin?
     - `superUser` - Is sender super user?
     - And more...

### Example Command Structure

```javascript
const { zokou } = require("../framework/zokou");

zokou({ 
  nomCom: "ping", 
  categorie: "General",
  reaction: "🏓" 
}, async (dest, zk, commandeOptions) => {
  const { repondre } = commandeOptions;
  repondre("Pong! 🏓");
});
```

---

## Database Structure

The bot uses **MongoDB** with Mongoose. Each feature has its own model:

### Database Models (in `bdd/` folder):

1. **antilien.js** - Anti-link settings per group
   - `jid` - Group JID
   - `etat` - `oui`/`non` (enabled/disabled)
   - `action` - `remove`/`delete`/`warn`

2. **antibot.js** - Anti-bot settings per group
   - Similar structure to antilien

3. **sudo.js** - Sudo users (elevated permissions)
   - `jid` - User JID

4. **banUser.js** - Banned users
   - `jid` - Banned user JID

5. **banGroup.js** - Banned groups
   - `jid` - Banned group JID

6. **onlyAdmin.js** - Groups where only admins can use commands
   - `jid` - Group JID

7. **warn.js** - User warning counts
   - `jid` - User JID
   - `warnCount` - Number of warnings

8. **level.js** - User level/XP system
   - Tracks user activity

9. **welcome.js** - Welcome/goodbye settings
   - `group_id` - Group JID
   - `welcome` - `on`/`off`
   - `goodbye` - `on`/`off`
   - `antipromote` - `on`/`off`
   - `antidemote` - `on`/`off`

10. **cron.js** - Scheduled tasks (auto-mute/unmute)
    - `group_id` - Group JID
    - `mute_at` - Time to mute (HH:MM)
    - `unmute_at` - Time to unmute (HH:MM)

11. **mention.js** - Auto-mention responses
    - Settings for when bot is mentioned

---

## Key Features

### 1. **Permission System**

**User Levels:**
- **Owner** - Full access (defined in `NUMERO_OWNER`)
- **Dev** - Developers (hardcoded numbers)
- **SuperUser** - Owner + Sudo users
- **Admin** - Group administrators
- **Regular User** - Everyone else

### 2. **Security Features**

- **Anti-Link**: Removes links, can warn/delete/remove user
- **Anti-Bot**: Detects bot messages (by message ID pattern)
- **Anti-Delete**: Tracks and reports deleted messages
- **Ban System**: Prevents banned users/groups from using bot
- **PM Permit**: Can restrict commands in private messages

### 3. **Group Management**

- **Welcome Messages**: Customizable welcome for new members
- **Goodbye Messages**: Messages when members leave
- **Anti-Promote**: Prevents unauthorized admin promotions
- **Anti-Demote**: Prevents unauthorized admin demotions
- **Auto-Mute/Unmute**: Scheduled group muting

### 4. **Command Categories**

Commands are organized into categories:
- General
- Mods (Moderation)
- Games
- Media (image/video processing)
- And more...

---

## Configuration

### Environment File: `set.env`

Create a `set.env` file (use `exemple_de_set.env` as template):

```env
OWNER_NAME="Your Name"
PREFIX="."
PUBLIC_MODE="yes"
AUTO_READ_STATUS="yes"
AUTO_DOWNLOAD_STATUS="no"
BOT_NAME="Encrypto27 AI"
NUMERO_OWNER="1234567890"
MONGO_URI="mongodb://localhost:27017/botdb"
WARN_COUNT="3"
STARTING_BOT_MESSAGE="yes"
ANTI_DELETE_MESSAGE="no"
SESSION_ID="your_base64_session_here"
```

### Important Notes:

- **SESSION_ID**: Base64 encoded WhatsApp credentials (or leave empty to scan QR)
- **MONGO_URI**: MongoDB connection string
- **PUBLIC_MODE**: `yes` = anyone can use commands, `no` = only super users
- **PREFIX**: Command prefix (default: `.`)

---

## How It Works

### Startup Flow:

1. **Load Configuration** (`set.js`)
   - Reads `set.env`
   - Connects to MongoDB

2. **Initialize WhatsApp** (`index.js`)
   - Loads/creates session from `auth/creds.json`
   - Connects to WhatsApp Web
   - Generates QR code if needed

3. **Load Commands**
   - Scans `Andbad_cmds/` folder
   - Requires all `.js` files
   - Commands register themselves via `zokou()`

4. **Event Listeners**
   - `messages.upsert` - New messages
   - `group-participants.update` - Group changes
   - `connection.update` - Connection status
   - `creds.update` - Session updates

5. **Message Processing**
   - Extract message content
   - Check if it's a command (starts with prefix)
   - Validate permissions
   - Execute command
   - Apply security features (anti-link, anti-bot, etc.)

### Message Flow:

```
Incoming Message
    ↓
Extract Content & Metadata
    ↓
Check Security (Anti-Link, Anti-Bot, etc.)
    ↓
Is Command? (starts with prefix)
    ↓ YES
Find Command in Registry
    ↓
Check Permissions (banned? admin-only? public mode?)
    ↓
Execute Command Function
    ↓
Send Response
```

---

## Command Examples

### Simple Command:
```javascript
// Andbad_cmds/ping.js
const { zokou } = require("../framework/zokou");

zokou({ nomCom: "ping", categorie: "General" }, 
  async (dest, zk, { repondre }) => {
    repondre("Pong! 🏓");
  }
);
```

### Command with Arguments:
```javascript
zokou({ nomCom: "say", categorie: "General" }, 
  async (dest, zk, { repondre, arg }) => {
    const text = arg.join(" ");
    repondre(text);
  }
);
```

### Command with Media:
```javascript
zokou({ nomCom: "mypic", categorie: "General" }, 
  async (dest, zk, { repondre, mybotpic }) => {
    zk.sendMessage(dest, { 
      image: { url: mybotpic() },
      caption: "Bot picture!"
    });
  }
);
```

---

## Running the Bot

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `exemple_de_set.env` to `set.env`
   - Fill in your settings

3. **Set Up MongoDB:**
   - Install MongoDB or use cloud service (MongoDB Atlas)
   - Update `MONGO_URI` in `set.env`

4. **Start Bot:**
   ```bash
   npm start
   # or
   node index.js
   ```

5. **First Run:**
   - Bot will generate QR code
   - Scan with WhatsApp (Settings → Linked Devices)
   - Session saved in `auth/creds.json`

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `index.js` | Main bot logic, event handlers |
| `set.js` | Configuration loader |
| `framework/zokou.js` | Command registration system |
| `bdd/*.js` | Database models and functions |
| `Andbad_cmds/*.js` | Bot commands |
| `auth/creds.json` | WhatsApp session (auto-generated) |
| `set.env` | Configuration file (you create this) |

---

## Tips for Maintenance

1. **Adding Commands**: Create new `.js` file in `Andbad_cmds/` and use `zokou()` to register
2. **Database**: All database functions are in `bdd/` folder - each feature has its own file
3. **Session**: Don't delete `auth/creds.json` - it contains your WhatsApp session
4. **Logs**: Check console for errors and command loading status
5. **Permissions**: Use `superUser`, `verifAdmin`, etc. from `commandeOptions` to control access

---

## Common Issues

1. **Bot not responding**: Check if `PUBLIC_MODE="yes"` or you're a super user
2. **Commands not loading**: Check console for errors when loading command files
3. **MongoDB errors**: Ensure MongoDB is running and `MONGO_URI` is correct
4. **Session expired**: Delete `auth/creds.json` and rescan QR code

---

*Last Updated: Based on codebase review*