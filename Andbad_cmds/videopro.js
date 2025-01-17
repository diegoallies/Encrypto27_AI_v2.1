const axios = require('axios');
const yts = require('yt-search');
const { zokou } = require('../framework/zokou');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const moment = require('moment-timezone');
const s = require(__dirname + "/../set");

zokou(
    {
        nomCom: 'videopro',
        categorie: 'media'
    },
    async (dest, zk, commandeOptions) => {
        const { ms, arg, repondre, superUser } = commandeOptions;

        // Ensure the query (search term) is provided
        if (!arg || !arg[0]) {
            return repondre("*Example*: .videopro Faded by Alan Walker");
        }

        try {
            const q = arg.join(' '); // join the query
            const searchResults = await yts(q);
            const video = searchResults.all[0];

            if (!video) {
                return repondre(`*No video found for ${q}*`);
            }

            const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4`;
            const apiResponse = await axios.get(apiUrl, { params: { url: video.url } });

            if (apiResponse.data.success) {
                const { title, download_url, filesize, timestamp } = apiResponse.data.result;
                
                const downloadMsg = `
                    *Video found!* \n\n
                    *Title:* ${title}\n
                    *Size:* ${filesize}\n
                    *Duration:* ${timestamp}\n
                    *Downloading...*`;

                // Send download link with video preview
                await zk.sendMessage(dest, {
                    video: { url: download_url },
                    mimetype: 'video/mp4',
                    caption: `📹 *${title}*\n\n${downloadMsg}`
                }, { quoted: ms });

            } else {
                repondre(`*Error downloading video! Please try again later.*`);
            }
        } catch (error) {
            console.error('Error during video download:', error);
            repondre(`*An error occurred while processing your request.*`);
        }
    }
);