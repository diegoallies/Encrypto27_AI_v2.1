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

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map(async (com, index) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const currentTime = moment().format('HH:mm:ss');
    const currentDate = moment().format('DD/MM/YYYY');

    // Main information message
    let infoMsg = `
╭─────────────────────╮
│      𝙴𝙽𝙲𝚁𝚈𝙿𝚃𝙾𝟸𝟽 𝙰𝙸       │
│   Your Personal Assistant │
╰─────────────────────╯

💻 *System Info*  
   • Time: ${currentTime}  
   • Date: ${currentDate}  
   • Mode: ${mode.toUpperCase()}  

📊 *System Stats*  
   • RAM: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}  
   • OS: ${os.platform()}  
   • Plugins: ${cm.length}  

🗂️ Type a command to proceed!
═════════════════════════════
`;

    let menuMsg = `
*Command Categories:*${readmore}
`;

    for (const cat in coms) {
        menuMsg += `
- *${cat}*:
  ${coms[cat].map(cmd => `• ${cmd}`).join("\n  ")}
`;
    }

    menuMsg += `
═════════════════════════════
> Created by *Encrypto27 AI*.
`;

    // ASCII Art
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
`;

    var mediaUrl = mybotpic();

    if (mediaUrl.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(dest, {
                video: { url: mediaUrl },
                caption: infoMsg + menuMsg + asciiArt,
                footer: "Powered by Encrypto27 AI",
                gifPlayback: true,
            }, { quoted: ms });
        } catch (e) {
            console.log("Error sending menu video: " + e);
            repondre("Error sending menu: " + e);
        }
    } else if (mediaUrl.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(dest, {
                image: { url: mediaUrl },
                caption: infoMsg + menuMsg + asciiArt,
                footer: "Powered by Encrypto27 AI",
            }, { quoted: ms });
        } catch (e) {
            console.log("Error sending menu image: " + e);
            repondre("Error sending menu: " + e);
        }
    } else {
        repondre(infoMsg + menuMsg + asciiArt);
    }
});