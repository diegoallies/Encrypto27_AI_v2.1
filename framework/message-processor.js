/**
 * Message Processing Utilities
 * Clean extraction of message metadata and content
 */

const { getContentType, jidDecode } = require("@whiskeysockets/baileys");

/**
 * Decode JID to standard format
 */
function decodeJid(jid) {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
    }
    return jid;
}

/**
 * Extract text content from message based on type
 */
function extractText(message, mtype) {
    switch (mtype) {
        case "conversation":
            return message.conversation || "";
        case "imageMessage":
            return message.imageMessage?.caption || "";
        case "videoMessage":
            return message.videoMessage?.caption || "";
        case "extendedTextMessage":
            return message.extendedTextMessage?.text || "";
        case "buttonsResponseMessage":
            return message.buttonsResponseMessage?.selectedButtonId || "";
        case "listResponseMessage":
            return message.listResponseMessage?.singleSelectReply?.selectedRowId || "";
        default:
            return "";
    }
}

/**
 * Get message type
 */
function getMessageType(message) {
    return getContentType(message);
}

/**
 * Extract all message metadata
 */
function extractMessageMetadata(ms, zk) {
    const mtype = getMessageType(ms.message);
    const texte = extractText(ms.message, mtype);
    const origineMessage = ms.key.remoteJid;
    const idBot = decodeJid(zk.user.id);
    const servBot = idBot.split('@')[0];
    const verifGroupe = origineMessage?.endsWith("@g.us");
    
    let auteurMessage = verifGroupe 
        ? (ms.key.participant || ms.participant) 
        : origineMessage;
    
    if (ms.key.fromMe) {
        auteurMessage = idBot;
    }
    
    const msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
    const mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const utilisateur = mr || (msgRepondu ? auteurMsgRepondu : "");
    
    return {
        mtype,
        texte,
        origineMessage,
        idBot,
        servBot,
        verifGroupe,
        auteurMessage,
        msgRepondu,
        auteurMsgRepondu,
        utilisateur,
        nomAuteurMessage: ms.pushName
    };
}

/**
 * Get group admins from participants
 */
function getGroupAdmins(participants) {
    if (!participants || !Array.isArray(participants)) return [];
    return participants
        .filter(p => p.admin !== null && p.admin !== undefined)
        .map(p => p.id);
}

module.exports = {
    decodeJid,
    extractText,
    getMessageType,
    extractMessageMetadata,
    getGroupAdmins
};
