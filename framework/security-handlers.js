/**
 * Security Handlers
 * Anti-link, anti-bot, and other security features
 */

const fs = require('fs-extra');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { delay } = require("@whiskeysockets/baileys");

/**
 * Handle anti-link security action
 */
async function handleAntiLinkAction(zk, origineMessage, auteurMessage, ms, action, conf) {
    const key = {
        remoteJid: origineMessage,
        fromMe: false,
        id: ms.key.id,
        participant: auteurMessage
    };
    
    let txt = "Link detected,\n";
    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
    
    try {
        const sticker = new Sticker(gifLink, {
            pack: 'Encrypto27-MD',
            author: conf.OWNER_NAME,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: '#000000'
        });
        await sticker.toFile("st1.webp");
        
        if (action === 'remove') {
            txt += `Message deleted\n@${auteurMessage.split("@")[0]} removed from group.`;
            await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            await delay(800);
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            } catch (e) {
                console.log("Anti-link error:", e);
            }
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp");
        } else if (action === 'delete') {
            txt += `Message deleted\n@${auteurMessage.split("@")[0]} avoid sending links.`;
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp");
        } else if (action === 'warn') {
            const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount } = require('../bdd/warn');
            const warn = await getWarnCountByJID(auteurMessage);
            const warnLimit = parseInt(conf.WARN_COUNT || "3", 10);
            
            if (warn >= warnLimit) {
                const kikmsg = `Link detected, you will be removed because of reaching warn-limit`;
                await zk.sendMessage(origineMessage, { text: kikmsg, mentions: [auteurMessage] }, { quoted: ms });
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                await zk.sendMessage(origineMessage, { delete: key });
            } else {
                const rest = warnLimit - warn;
                const msg = `Link detected, your warn_count was upgraded;\nRemaining: ${rest}`;
                await ajouterUtilisateurAvecWarnCount(auteurMessage);
                await zk.sendMessage(origineMessage, { text: msg, mentions: [auteurMessage] }, { quoted: ms });
                await zk.sendMessage(origineMessage, { delete: key });
            }
            await fs.unlink("st1.webp");
        }
    } catch (error) {
        console.error("Error in anti-link handler:", error);
        if (fs.existsSync("st1.webp")) {
            await fs.unlink("st1.webp").catch(() => {});
        }
    }
}

/**
 * Handle anti-bot security action
 */
async function handleAntiBotAction(zk, origineMessage, auteurMessage, ms, action, conf) {
    const key = {
        remoteJid: origineMessage,
        fromMe: false,
        id: ms.key.id,
        participant: auteurMessage
    };
    
    let txt = "Bot detected,\n";
    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
    
    try {
        const sticker = new Sticker(gifLink, {
            pack: 'Encrypto27-MD',
            author: conf.OWNER_NAME,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: '#000000'
        });
        await sticker.toFile("st1.webp");
        
        if (action === 'remove') {
            txt += `Message deleted\n@${auteurMessage.split("@")[0]} removed from group.`;
            await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            await delay(800);
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            } catch (e) {
                console.log("Anti-bot error:", e);
            }
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp");
        } else if (action === 'delete') {
            txt += `Message deleted\n@${auteurMessage.split("@")[0]} avoid sending bot messages.`;
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp");
        } else if (action === 'warn') {
            const { getWarnCountByJID, ajouterUtilisateurAvecWarnCount } = require('../bdd/warn');
            const warn = await getWarnCountByJID(auteurMessage);
            const warnLimit = parseInt(conf.WARN_COUNT || "3", 10);
            
            if (warn >= warnLimit) {
                const kikmsg = `Bot detected, you will be removed because of reaching warn-limit`;
                await zk.sendMessage(origineMessage, { text: kikmsg, mentions: [auteurMessage] }, { quoted: ms });
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                await zk.sendMessage(origineMessage, { delete: key });
            } else {
                const rest = warnLimit - warn;
                const msg = `Bot detected, your warn_count was upgraded;\nRemaining: ${rest}`;
                await ajouterUtilisateurAvecWarnCount(auteurMessage);
                await zk.sendMessage(origineMessage, { text: msg, mentions: [auteurMessage] }, { quoted: ms });
                await zk.sendMessage(origineMessage, { delete: key });
            }
            await fs.unlink("st1.webp");
        }
    } catch (error) {
        console.error("Error in anti-bot handler:", error);
        if (fs.existsSync("st1.webp")) {
            await fs.unlink("st1.webp").catch(() => {});
        }
    }
}

module.exports = {
    handleAntiLinkAction,
    handleAntiBotAction
};
