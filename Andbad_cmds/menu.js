const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = "public";

    if ((s.MODE).toLocaleLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭─────────────────────────────────────────────╮
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   💻 *𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸*                    │
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   𓊈𒆜 𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𝕋𝔼ℂℍ. 𒆜𓊉      │
╰─────────────────────────────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━❰ *BOT INFO* ❱━━━━━━━━━━━━━━━━━╮
┃ ════════════════════════════
┃  ⚡️ ▪️ *PLUGINS*    : ${cm.length}   
┃  💾 ▪️ *RAM*        : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}    
┃  🖥️ ▪️ *SAVER*      : ${os.platform()}         
┃  🎨 ▪️ *THEME*      : 𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𝔸𝕀  
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🗣️ _*Type the command to proceed.*_  
═══════════════════════════════
💡 _*𝔼_𝔸_𝕀_*  
═══════════════════════════════\n`;

    let menuMsg = `
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
███████████

*COMMANDS*${readmore}             

███████████
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`;

    for (const cat in coms) {
        menuMsg += `
╭━━❯ *${cat}* ❯━━━━━━━━━━━━━━━━━
│ ⚡️  ▪️ Commands in ${cat}
│ ─────────────────────────
`;
        for (const cmd of coms[cat]) {
            menuMsg += `
│ ➕  ▪️ ${cmd}`;
        }
        menuMsg += `
╰────────────────────────···▸▸\n`;
    }

    menuMsg += `
> █████ Created by 𝙴𝚖𝚎𝚛𝚐𝚎𝚗𝚌𝚢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𓊈𒆜 _𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽_𒆜𓊉
`;

    let asciiArt = `
          ^         
         | |        
       @#####@      
     (###   ###)-.  
   .(###     ###) \\ 
  /  (###   ###)   )
 (=-  .@#####@|_--"  
 /\\    \\_|l|_/ (\\    
(=-\\     |l|    /   
 \\  \\.___|l|___/    
 /\\      |_|   /    
(=-\\._________/\\    
 \\             /    
   \\._________/     
     #  ----  #     
     #   __   #       
     \\########/      
         V
             V
           V

https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M
`;

    let lien = mybotpic();

    try {
        // Check if `lien` is defined and is a valid URL
        if (!lien || typeof lien !== 'string') {
            throw new Error("Invalid bot picture URL.");
        }

        await zk.sendMessage(dest, {
            image: { url: lien },
            caption: infoMsg + menuMsg + asciiArt,
            footer: "Powered by ENCRYPTO-27",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363304325601080@newsletter",
                    newsletterName: "『 𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 ᴍᴅ 』",
                    serverMessageId: 143
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            audio: { url: "https://raw.githubusercontent.com/diegoallies/Dataaudio/main/Intro.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
        }, { quoted: ms });
    } catch (e) {
        console.log("Error sending menu:", e);
        repondre("🥵 Error generating menu: " + e.message);
    }
});