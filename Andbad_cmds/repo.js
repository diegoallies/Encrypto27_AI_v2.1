const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "repo", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }


    

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
╔════════════════╗  
  🚀 *REPOS & GROUPS* 🚀  
╚════════════════╝  
  
📢 *CHANNEL*  
➤ https://whatsapp.com/channel/0029Vb3ErqhA2pLCoqgxXx1M  
  
👥 *GROUP*  
➤ https://chat.whatsapp.com/CA7bhs9XrzB5iywo7mCqaV  
  
💻 *REPO*  
➤ https://github.com/diegoallies/Encrypto27_AI_v2.1/  
  
  
═════════════════════  
🎨 *DESIGNED BY*  
✞𓊈𒆜   𝙳𝚄𝙳𝙰𝚂   𒆜𓊉 ✞  
═════════════════════  
  
🔔 *Stay Connected!*  
💬 _Join us for updates and exclusive content._  
  
🔥 *DON’T FORGET TO:*  
➤ Star the repo ⭐  
➤ FOLLOW WAchannel 🔔  
➤ Share with friends \n
  `;
    
let menuMsg = `
     BOT CREATED BY ✞𓊈𒆜 𝙴𝚗𝚌𝚛𝚢𝚙𝚝𝚘𝟸𝟽 𒆜𓊉 ✞

❒────────────────────❒`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Beltahmd*, déveloper Beltah Tech" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu error " + e);
        repondre("🥵🥵 Menu error " + e);
    }
} 
// Check for .jpeg or .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Beltahmd*, déveloper Beltah Tech" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu error " + e);
        repondre("🥵🥵 Menu error " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
}

}); 
