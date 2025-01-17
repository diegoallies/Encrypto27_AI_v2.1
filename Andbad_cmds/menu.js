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

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // Text message formatting
    let infoMsg = `
╭─────────────────────────────────────────────╮
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   💻 *𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸*                    │
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   𓊈𒆜 𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𝕋𝔼ℂℍ. 𒆜𓊉      │
╰─────────────────────────────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━❰ *AVAILABLE MENUS* ❱━━━━━━━━━━━━━━━━━╮
┃  🔥  ▪️ *MENU*                
┃  🔥  ▪️ *MENU2*              
┃  🔥  ▪️ *BUGMENU*             
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

    // ASCII art of a person smoking on a laptop, placed at the end of the message
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
`;

    let lien = await mybotpic();
    let channelLink = "https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M";

    try {
        // Send the image with the caption, menu, and channel link
        await zk.sendMessage(dest, {
            image: { url: lien },
            caption: infoMsg + menuMsg + asciiArt + `\n\n📢 [Join Our Channel](${channelLink})`,
            footer: "Powered by ENCRYPTO-27",
            contextInfo: {
                forwardingScore: 2, // Simulate forwarded message
                isForwarded: true,  // Set as forwarded message
                externalAdReply: {
                    title: "Join Our Channel",
                    body: "Stay updated with the latest news!",
                    mediaType: 2, // 2 for link preview
                    thumbnail: lien, // Thumbnail for the link preview
                    mediaUrl: channelLink,
                    sourceUrl: channelLink
                }
            }
        }, { quoted: ms });

        // Send the audio message
        await zk.sendMessage(dest, {
            audio: { url: "https://raw.githubusercontent.com/diegoallies/Dataaudio/main/Intro.mp3" },
            mimetype: "audio/mpeg",
            ptt: true,
        }, { quoted: ms });
    } catch (e) {
        console.log("Error sending menu:", e);
        repondre("🥵 Error generating menu: " + e.message);
    }
});