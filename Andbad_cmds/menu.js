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

    let channelLink = "https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M";

    let messageOptions = {
        caption: infoMsg + `\n\n📢 [View Channel](${channelLink})`,
        footer: "Powered by ENCRYPTO-27",
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [],
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363304325601080@newsletter",
                newsletterName: "𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 W.A Channel",
            },
        },
    };

    try {
        // Send the image with the caption and channel button
        await zk.sendMessage(dest, {
            image: { url: mybotpic() },
            ...messageOptions,
        }, { quoted: ms });

        // Send the audio message
        await zk.sendMessage(dest, {
            audio: { url: "/mnt/data/Intro_converted.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
        }, { quoted: ms });
    } catch (e) {
        console.log("Error sending menu:", e);
        repondre("🥵 Error generating menu: " + e.message);
    }
});