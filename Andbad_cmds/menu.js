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

    // Main menu content
    let infoMsg = `
╭─────────────────────────────────────────────╮
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   💻 *𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸*                    │
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   𓊈𒆜 𝔼ℕℂℝ𝕐ℙℙ𝕋𝕆-𝟚𝟟 𝕋𝔼ℂℍ. 𒆜𓊉      │
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
> █████ Created by 𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘-27 Team.`;

    let asciiArt = `
          ^         
         | |        
       @#####@      
     (###   ###)-.  
   .(###     ###) \ 
  /  (###   ###)   )
 (=-  .@#####@|_--"  
 /\    \_|l|_/ (\    
(=-\     |l|    /   
 \  \.___|l|___/    
 /\      |_|   /    
(=-\._________/\    
 \             /    
   \._________/     
     #  ----  #     
     #   __   #       
     \########/      
         V
             V
           V
`;

    var lien = mybotpic();

    try {
        if (lien.match(/\.(mp4|gif)$/i)) {
            await zk.sendMessage(dest, { video: { url: lien }, caption: infoMsg + menuMsg + asciiArt, footer: "I am *DUDAS*, creator of 𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸", gifPlayback: true }, { quoted: ms });
        } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
            await zk.sendMessage(dest, { image: { url: lien }, caption: infoMsg + menuMsg + asciiArt, footer: "I am *msela-chui-v2*, creator of msela-chui Tech" }, { quoted: ms });
        } else {
            await repondre(infoMsg + menuMsg + asciiArt);
        }

        // Add WhatsApp Channel
        await zk.sendMessage(dest, {
            text: "Join our official channel for updates: [Click Here](https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M)",
            contextInfo: {
                externalAdReply: {
                    title: "Visit Channel",
                    body: "Official Updates",
                    mediaType: 3,
                    thumbnailUrl: "https://i.ibb.co/hx0rGm5/Encrypto.webp",
                    sourceUrl: "https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M"
                }
            }
        }, { quoted: ms });

        // Adding audio message
        await zk.sendMessage(dest, {
            audio: { url: "https://github.com/mrfrank-ofc/SUBZERO-MD-DATABASE/raw/refs/heads/main/audios/subzero-yali.mp3" },
            mimetype: "audio/mp4",
            ptt: true
        }, { quoted: ms });

    } catch (e) {
        console.log("🥵🥵 Menu error " + e);
        repondre("🥵🥵 Menu error " + e);
    }
});