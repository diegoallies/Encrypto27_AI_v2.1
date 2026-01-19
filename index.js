"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/ENCRYPTO27_MD;;;/g,"");
const prefixe = conf.PREFIXE;


async function authentification() {
    try {
       
        //console.log("le data "+data)
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("Connection in progress...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
            //console.log(session)
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalide " + e);
        return;
    }
}
authentification();
// Create a simple in-memory store (makeInMemoryStore not available in this Baileys version)
const store = {
    messages: {},
    contacts: {},
    chats: {},
    loadMessage: async (jid, id) => {
        if (store.messages[jid] && store.messages[jid][id]) {
            return store.messages[jid][id];
        }
        return null;
    },
    bind: (ev) => {
        // Listen to messages and cache them
        ev.on('messages.upsert', ({ messages }) => {
            for (const msg of messages) {
                if (!store.messages[msg.key.remoteJid]) {
                    store.messages[msg.key.remoteJid] = {};
                }
                store.messages[msg.key.remoteJid][msg.key.id] = msg;
            }
        });
        // Listen to contacts
        ev.on('contacts.upsert', (contacts) => {
            for (const contact of contacts) {
                store.contacts[contact.id] = contact;
            }
        });
    },
    writeToFile: (filename) => {
        try {
            fs.writeFileSync(filename, JSON.stringify({
                messages: store.messages,
                contacts: store.contacts
            }, null, 2));
        } catch (e) {
            // Ignore write errors
        }
    }
};

// Initialize Pairing Server
const PairingServer = require('./pairing-server');
const pairingServer = new PairingServer(process.env.PAIRING_PORT || 3000);

// Start pairing server (non-blocking)
pairingServer.start().catch(err => {
    console.error('⚠️  Failed to start pairing server:', err.message);
    console.log('⚠️  Bot will continue without web pairing interface. QR code will be shown in terminal if needed.\n');
});

setTimeout(() => {
    async function main() {
        // Reset connection failure counter
        global.connectionFailureCount = 0;
        
        console.log('🔄 Starting WhatsApp connection...');
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        
        // Log if we have existing credentials
        if (state.creds && state.creds.me) {
            console.log('📱 Using existing session for:', state.creds.me.id);
        } else {
            console.log('📱 No existing session - QR code will be generated');
        }
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Encrypto27-MD', "safari", "1.0.0"],
            // printQRInTerminal removed - using web interface instead
            fireInitQueries: false,
            // shouldSyncHistoryMessage removed - not compatible with Baileys 6.7.19
            // downloadHistory: true, // Removed - may cause issues
            // syncFullHistory: true, // Removed - may cause issues
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            /* auth: state*/ auth: {
                creds: state.creds,
                /** caching makes the store faster to send/recv messages */
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            //////////
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
            ///////
            };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        setInterval(() => { store.writeToFile("store.json"); }, 3000);
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;

            // Use message processor utilities
            const { extractMessageMetadata, getGroupAdmins, decodeJid } = require("./framework/message-processor");
            const { isSuperUser, isDev, isGroupAdmin } = require("./framework/permissions");
            const { getAllSudoNumbers } = require("./bdd/sudo");
            
            const metadata = extractMessageMetadata(ms, zk);
            const { mtype, texte, origineMessage, idBot, servBot, verifGroupe, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = metadata;
            
            // Get group info if group message
            const infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : null;
            const nomGroupe = verifGroupe ? infosGroupe.subject : "";
            const membreGroupe = verifGroupe ? ms.key.participant : '';
            const mbre = verifGroupe ? infosGroupe.participants : [];
            
            // Check permissions
            const superUser = await isSuperUser(auteurMessage, conf, getAllSudoNumbers);
            const dev = isDev(auteurMessage);
            const admins = verifGroupe ? getGroupAdmins(mbre) : [];
            const verifAdmin = verifGroupe ? isGroupAdmin(auteurMessage, admins) : false;
            const verifZokouAdmin = verifGroupe ? isGroupAdmin(idBot, admins) : false;
            
            
            // Reply function
            async function repondre(mes) { 
                return await zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); 
            }
            
            // Log message info
            console.log("\t [][]...{Encrypto27 MD}...[][]");
            console.log("=========== Nouveau message ===========");
            if (verifGroupe) {
                console.log("Message from group: " + nomGroupe);
            }
            console.log("Message sent by: [" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + "]");
            console.log("Message type: " + mtype);
            console.log("------ Message content ------");
            console.log(texte);

            // Update presence based on config
            const etat = conf.ETAT;
            const presenceMap = {
                '1': 'available',
                '2': 'composing',
                '3': 'recording'
            };
            const presence = presenceMap[etat] || 'unavailable';
            await zk.sendPresenceUpdate(presence, origineMessage);
            // Random bot picture function
            const botPicUrls = conf.URL.split(',');
            function mybotpic() {
                const randomIndex = Math.floor(Math.random() * botPicUrls.length);
                return botPicUrls[randomIndex];
            }
            
            // Command parsing
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
            
            // Command options for handlers
            const commandeOptions = {
                superUser,
                dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                admins,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic,
                zk
            };


            /************************ anti-delete-message */

            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {

                if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { console.log('Message supprimer me concernant') ; return }
        
                                console.log(`Message deleted`)
                                let key =  ms.message.protocolMessage.key ;
                                
        
                               try {
        
                                  let st = './store.json' ;
        
                                const data = fs.readFileSync(st, 'utf8');
        
                                const jsonData = JSON.parse(data);
        
                                    let message = jsonData.messages[key.remoteJid] ;
                                
                                    let msg ;

        for (let i = 0 ; i < message.length ; i++) {
        
                                        if (message[i].key.id === key.id) {
                                            
                                            msg = message[i] ;
        
                                            break 
                                        }
        
                                    } 
        
                                  //  console.log(msg)
        
                                    if(msg === null || !msg ||msg === 'undefined') {console.log('Message not found') ; return } 
        
                                await zk.sendMessage(idBot,{ image : { url : './media/deleted-message.jpg'},caption : `        😈Anti-delete-message😈\n Message from @${msg.key.participant.split('@')[0]}​` , mentions : [msg.key.participant]},)
                                .then( () => {
                                    zk.sendMessage(idBot,{forward : msg},{quoted : msg}) ;
                                })
                               
                              
        
                               } catch (e) {
                                    console.log(e)
                               }
                            }
        
            /** ****** gestion auto-status  */
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                /* await zk.readMessages([ms.key]);*/
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
                /** *************** */
                // console.log("*nouveau status* ");
            }
            /** ******fin auto-status */
            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }

            //---------------------------------------rang-count--------------------------------
             if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
  const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
  try {
    await ajouterOuMettreAJourUserData(auteurMessage);
  } catch (e) {
    console.error(e);
  }
              }
            
                /////////////////////////////   Mentions /////////////////////////////////////////
         
              try {
        
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))    /*texte.includes(idBot.split('@')[0]) || texte.includes(conf.NUMERO_OWNER)*/) {
            
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
            
                    if(superUser) {console.log('hummm') ; return ;} 
                    
                    let mbd = require('./bdd/mention') ;
            
                    let alldata = await mbd.recupererToutesLesValeurs() ;
            
                        let data = alldata[0] ;
            
                    if ( data.status === 'non') { console.log('mention pas actifs') ; return ;}
            
                    let msg ;
            
                    if (data.type.toLocaleLowerCase() === 'image') {
            
                        msg = {
                                image : { url : data.url},
                                caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
            
                            msg = {
                                    video : {   url : data.url},
                                    caption : data.message
                            }

                            } else if (data.type.toLocaleLowerCase() === 'sticker') {
            
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                          });
            
                          const stickerBuffer2 = await stickerMess.toBuffer();
            
                          msg = {
                                sticker : stickerBuffer2 
                          }
            
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
            
                            msg = {
            
                                audio : { url : data.url } ,
                                mimetype:'audio/mp4',
                                 }
                        
                    }
            
                    zk.sendMessage(origineMessage,msg,{quoted : ms})
            
                }
            } catch (error) {
                
            } 


            // Anti-link handler
            try {
                const isAntiLinkActive = await verifierEtatJid(origineMessage);
                if (texte.includes('https://') && verifGroupe && isAntiLinkActive) {
                    console.log("Link detected");
                    const verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
                    
                    if (superUser || verifAdmin || !verifZokAdmin) {
                        console.log('Skipping anti-link - user has permission');
                        return;
                    }
                    
                    const { handleAntiLinkAction } = require("./framework/security-handlers");
                    const action = await recupererActionJid(origineMessage);
                    await handleAntiLinkAction(zk, origineMessage, auteurMessage, ms, action, conf);
                }
            } catch (e) {
                console.log("Anti-link error:", e);
            }








            // Anti-bot handler
            try {
                const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
                const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
                if (botMsg || baileysMsg) {
                    if (mtype === 'reactionMessage') {
                        console.log('Skipping reaction messages');
                        return;
                    }
                    
                    const isAntiBotActive = await atbverifierEtatJid(origineMessage);
                    if (!isAntiBotActive) return;

                    if (verifAdmin || auteurMessage === idBot) {
                        console.log('Skipping anti-bot - user has permission');
                        return;
                    }
                    
                    const { handleAntiBotAction } = require("./framework/security-handlers");
                    const action = await atbrecupererActionJid(origineMessage);
                    await handleAntiBotAction(zk, origineMessage, auteurMessage, ms, action, conf);
                }
            } catch (error) {
                console.log('Anti-bot error:', error);
            }        
             
         
            /////////////////////////
            
            //execution des commandes   
            if (verifCom) {
                //await await zk.readMessages(ms.key);
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {

            if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                return;
                }

            // PM_PERMIT check - block non-superUsers in PM if enabled
            // SuperUsers (owner/devs) should always have access, even in PM
            const isPM = origineMessage === auteurMessage;
            if (!superUser && isPM && conf.PM_PERMIT && conf.PM_PERMIT.toLowerCase() === "yes") {
                repondre("You don't have access to commands here. This bot only works in groups.");
                return;
            }
            ///////////////////////////////

             
            /*****************************banGroup  */
            if (!superUser && verifGroupe) {

                 let req = await isGroupBanned(origineMessage);
                    
                        if (req) { return }
            }

              /***************************  ONLY-ADMIN  */

            if(!verifAdmin && verifGroupe) {
                 let req = await isGroupOnlyAdmin(origineMessage);
                    
                        if (req) {  return }}

              /**********************banuser */
         
            
                if(!superUser) {
                    let req = await isUserBanned(auteurMessage);
                    
                        if (req) {repondre("You are banned from bot commands"); return}
                    

                } 

                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    }
                    catch (e) {
                        console.log("😡😡 " + e);
                        zk.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
            //fin exécution commandes
        });
        //fin événement message

/******** group update event ****************/
const { recupevents } = require('./bdd/welcome'); 

zk.ev.on('group-participants.update', async (group) => {
    console.log(group);

    let ppgroup;
    try {
        ppgroup = await zk.profilePictureUrl(group.id, 'image');
    } catch {
        ppgroup = 'https://telegra.ph/file/4cc2712eee93c105f6739.jpg';
    }

    try {
        const metadata = await zk.groupMetadata(group.id);

        if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
            let msg = `╔════◇◇◇═════╗
║ welcome to new(s) member(s)
║ *New(s) Member(s) :*
`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `║ @${membre.split("@")[0]}\n`;
            }

            msg += `║
╚════◇◇◇═════╝
◇ *Descriptioon*   ◇

${metadata.desc}`;

            zk.sendMessage(group.id, { image: { url: ppgroup }, caption: msg, mentions: membres });
        } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
            let msg = `one or somes member(s) left group;\n`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `@${membre.split("@")[0]}\n`;
            }

            zk.sendMessage(group.id, { text: msg, mentions: membres });

        } else if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on') ) {
            //  console.log(zk.user.id)
          if (group.author == metadata.owner || group.author  == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id)  || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


         await   zk.groupParticipantsUpdate(group.id ,[group.author,group.participants[0]],"demote") ;

         zk.sendMessage(
              group.id,
              {
                text : `@${(group.author).split("@")[0]} has violated the anti-promotion rule, therefore both ${group.author.split("@")[0]} and @${(group.participants[0]).split("@")[0]} have been removed from administrative rights.`,
                mentions : [group.author,group.participants[0]]
              }
         )

        } else if (group.action == 'demote' && (await recupevents(group.id, "antidemote") == 'on') ) {

            if (group.author == metadata.owner || group.author ==  conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


           await  zk.groupParticipantsUpdate(group.id ,[group.author],"demote") ;
           await zk.groupParticipantsUpdate(group.id , [group.participants[0]] , "promote")

           zk.sendMessage(
                group.id,
                {
                  text : `@${(group.author).split("@")[0]} has violated the anti-demotion rule by removing @${(group.participants[0]).split("@")[0]}. Consequently, he has been stripped of administrative rights.` ,
                  mentions : [group.author,group.participants[0]]
                }
           )

     } 

         } catch (e) {
        console.error(e);
    }
});

/******** end group update event *************************/



    /*****************************Cron setup */

        
    async  function activateCrons() {
        const cron = require('node-cron');
        const { getCron } = require('./bdd/cron');

          let crons = await getCron();
          console.log(crons);
          if (crons.length > 0) {
        
            for (let i = 0; i < crons.length; i++) {
        
              if (crons[i].mute_at != null) {
                let set = crons[i].mute_at.split(':');

                console.log(`Setting up automute for ${crons[i].group_id} at ${set[0]}:${set[1]}`)

                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                  await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Hello, it's time to close the group; sayonara." });

                }, {
                    timezone: "Africa/Abidjan"
                  });
              }
        
              if (crons[i].unmute_at != null) {
                let set = crons[i].unmute_at.split(':');

                console.log(`Setting up autounmute for ${set[0]}:${set[1]}`)
        
                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {

                  await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement');

                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Good morning; It's time to open the group." });

                 
                },{
                    timezone: "Africa/Dodoma"
                  });
              }
        
            }
          } else {
                console.log('Crons were not activated');
          }

          return
        }


        //événement contact
        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    }
                    else {
                        store.contacts[contact.id] = contact;
                    }
                }
                return;
            };
            insertContact(contacts);
        });
        //end contact event 
        //connection event
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection, qr, isNewConnection } = con;
            
            // Debug: Log all connection update properties
            console.log("🔌 Connection update:", {
                connection,
                hasQR: !!qr,
                qrLength: qr ? qr.length : 0,
                hasPairingCode: !!con.pairingCode,
                pairingCode: con.pairingCode,
                isNewConnection,
                lastDisconnect: lastDisconnect ? lastDisconnect.error?.message : null
            });
            
            // Handle QR code for pairing - check multiple possible properties
            const qrCode = qr || con.qr || con.qrcode;
            if (qrCode) {
                console.log("📱 QR Code generated, length:", qrCode.length);
                await pairingServer.updateQR(qrCode);
                pairingServer.updateConnectionStatus('connecting', false);
            }
            
            // Handle pairing code if available (newer Baileys versions)
            const pairingCode = con.pairingCode || con.pairing_code;
            if (pairingCode) {
                console.log("🔢 Pairing code available:", pairingCode);
                pairingServer.updatePairingCode(pairingCode);
            }
            
            if (connection === "connecting") {
                console.log("ℹ️ ENCRYPTO27 MD CONNECTING...");
                pairingServer.updateConnectionStatus('connecting', false);
            }
            else if (connection === 'open') {
                pairingServer.updateConnectionStatus('connected', true);
                console.log("✅ Encrypto27 MD Connection Established! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("Encrypto27 MD is Online 🕸\n\n");
                //chargement des commandes 
                console.log("Loading Commands ...\n");
                fs.readdirSync(__dirname + "/Andbad_cmds").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/Andbad_cmds/" + fichier);
                            console.log(fichier + " installed ✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} could not be loaded for the following reason: ${e}`);
                        } /* require(__dirname + "/Andbad_cmds/" + fichier);
                         console.log(fichier + " installed ✔️")*/
                        (0, baileys_1.delay)(300);
                    }
                    });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                }
                else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                }
                else {
                    md = "undefined";
                }
                console.log("All Commands Installed ✅");

                await activateCrons();
                
                if((conf.DP).toLowerCase() === 'yes') {     
                let cmsg = `
╔════◇
║ 『ENCRYPTO-27 AI CONNECTED』
║    Prefix : [ ${prefixe} ]
║    Mode :${md}
║    Total Commands : ${evt.cm.length}︎
║     𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𝕋𝔼ℂℍℕ𝕆𝕃𝕆𝔾𝕀𝔼𝕊 
╚════════════════╝`;
                await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                pairingServer.updateConnectionStatus('disconnected', false);
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                
                // Check for connection failures that indicate invalid session
                const isConnectionFailure = lastDisconnect?.error?.message?.includes('Connection Failure') || 
                                          lastDisconnect?.error?.message?.includes('ECONNREFUSED');
                
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession || isConnectionFailure) {
                    console.log('⚠️ Invalid session detected. Deleting session to force QR code generation...');
                    // Delete invalid session files
                    try {
                        if (fs.existsSync(__dirname + "/auth/creds.json")) {
                            fs.unlinkSync(__dirname + "/auth/creds.json");
                            console.log('✅ Deleted invalid session file');
                        }
                        // Delete all auth files
                        const authFiles = fs.readdirSync(__dirname + "/auth");
                        authFiles.forEach(file => {
                            if (file !== 'File.js' && file !== 'encrypto27') {
                                fs.unlinkSync(__dirname + "/auth/" + file);
                            }
                        });
                        console.log('✅ Cleared auth directory. Restarting to generate new QR code...');
                    } catch (e) {
                        console.log('Error deleting session:', e);
                    }
                    // Wait a bit then restart
                    await (0, baileys_1.delay)(2000);
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! Connection closed, reconnecting...');
                    await (0, baileys_1.delay)(2000);
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('Connection to server lost 😞, reconnecting...');
                    await (0, baileys_1.delay)(2000);
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('Connection replaced - another session is already open. Please close it first!!!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('You are logged out. Please scan the QR code again');
                    // Delete session on logout
                    try {
                        if (fs.existsSync(__dirname + "/auth/creds.json")) {
                            fs.unlinkSync(__dirname + "/auth/creds.json");
                        }
                    } catch (e) {}
                    await (0, baileys_1.delay)(2000);
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('Restarting in progress ▶️');
                    await (0, baileys_1.delay)(2000);
                    main();
                } else {
                    console.log('Restarting due to error:', raisonDeconnexion);
                    // For unknown errors, also try deleting session if it keeps failing
                    if (isConnectionFailure) {
                        try {
                            if (fs.existsSync(__dirname + "/auth/creds.json")) {
                                fs.unlinkSync(__dirname + "/auth/creds.json");
                                console.log('✅ Deleted session due to connection failure');
                            }
                        } catch (e) {}
                    }
                    await (0, baileys_1.delay)(3000);
                    main();
                }
            }
        });
        //end connection event
        //authentication event 
        zk.ev.on("creds.update", saveCreds);
        //end authentication event 
        //
        /** ************* */
        //fonctions utiles
        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            // save to file
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };


zk.awaitForMessage = async (options = {}) =>{
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));
        
                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined
        
                /**
                 * 
                 * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
                 */
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
        
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                }
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        }



        // fin fonctions utiles
        /** ************* */
        return zk;
    }
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`Updated ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);
