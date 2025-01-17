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
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│   💻 *𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸*                    │
│   ░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
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
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
████████████████████████████████████████████████████████████████
*COMMANDS*${readmore}
████████████████████████████████████████████████████████████████
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
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
> ████████ 𝐂𝚪𝚵𝚫𝚻𝚵𝐂 𝚩 𝙴𝚖𝚎𝚛𝚐𝚎𝚗𝚌𝚢 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𓊈𒆜 _𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽_𒆜𓊉
`;

    // ASCII art of a person smoking on a laptop, placed at the end of the message
    let asciiArt = `
                 _______
               /        \\
              |  (o)  (o) |  
             _|     (_)    |_
            |  (    )       |
         ____|  \\_/  ____   |
        /     |    |    \\_  |
       /      |    |      |  |
      |       |    |      |  |
      |_______|____|______|__|
             //       \\
            //         \\
           //           \\
          //             \\
         //               \\
    `;
    
    var lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
        try {
            zk.sendMessage(dest, { video: { url: lien }, caption: infoMsg + menuMsg + asciiArt, footer: "I am *DUDAS*, creator of 𝙴𝚗𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𝙰𝙸", gifPlayback: true }, { quoted: ms });
        }
        catch (e) {
            console.log("🥵🥵 Menu error " + e);
            repondre("🥵🥵 Menu error " + e);
        }
    }
    // Check for .jpeg or .png
    else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
            zk.sendMessage(dest, { image: { url: lien }, caption: infoMsg + menuMsg + asciiArt, footer: "I am *msela-chui-v2*, creator of msela-chui Tech" }, { quoted: ms });
        }
        catch (e) {
            console.log("🥵🥵 Menu error " + e);
            repondre("🥵🥵 Menu error " + e);
        }
    }
    else {
        repondre(infoMsg + menuMsg + asciiArt);
    }
});