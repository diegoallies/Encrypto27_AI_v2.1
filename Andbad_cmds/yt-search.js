const { zokou } = require("../framework/zokou");
const { getytlink, ytdwn } = require("../framework/ytdl-core");
const yts = require("yt-search");
const ytdl = require('ytdl-core');
const fs = require('fs');

zokou({ nomCom: "yts", categorie: "Search", reaction: "✋" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  const query = arg.join(" ");

  if (!query) {
    return repondre("What do you want to search for?");
  }

  try {
    const info = await yts(query);
    const results = info.videos.slice(0, 10); // Only take top 10 results

    let captions = "";
    for (let i = 0; i < results.length; i++) {
      captions += `----------------\nTitle: ${results[i].title}\nTime: ${results[i].timestamp}\nUrl: ${results[i].url}\n`;
    }
    captions += "\n======\n*powered by yt-search*";

    // Send video search results as a message with the thumbnail of the first video
    zk.sendMessage(dest, { 
      image: { url: results[0].thumbnail }, 
      caption: captions 
    }, { quoted: ms });
  } catch (error) {
    repondre("An error occurred during the search: " + error.message);
  }
});

zokou({
  nomCom: "ytmp4",
  categorie: "Download",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    return repondre("Please provide a YouTube link.");
  }

  const topo = arg.join(" ");
  try {
    // Get video information from YouTube URL
    const videoInfo = await ytdl.getInfo(topo);
    // Choose the best format available
    const format = ytdl.chooseFormat(videoInfo.formats, { quality: '18' });

    // Download the video stream
    const videoStream = ytdl.downloadFromInfo(videoInfo, { format });

    // Save the video locally
    const filename = './video.mp4';
    const fileStream = fs.createWriteStream(filename);
    videoStream.pipe(fileStream);

    fileStream.on('finish', () => {
      // Send the video file once it has been downloaded
      zk.sendMessage(origineMessage, { 
        video: { url: filename }, 
        caption: "Powered by yt-download" 
      }, { quoted: ms });
    });

    fileStream.on('error', (error) => {
      console.error('Error while writing the video file:', error);
      repondre('An error occurred while downloading the video.');
    });
  } catch (error) {
    console.error('Error while searching or downloading the video:', error);
    repondre('An error occurred while processing the video download.');
  }
});

zokou({
  nomCom: "ytmp3",
  categorie: "Download",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre("Please provide a YouTube link.");
  }

  try {
    const topo = arg.join(" ");
    // Get audio stream from YouTube link
    const audioStream = ytdl(topo, { filter: 'audioonly', quality: 'highestaudio' });

    // Save the audio locally
    const filename = './audio.mp3';
    const fileStream = fs.createWriteStream(filename);
    audioStream.pipe(fileStream);

    fileStream.on('finish', () => {
      // Send the audio file once it has been downloaded
      zk.sendMessage(origineMessage, { 
        audio: { url: filename }, 
        mimetype: 'audio/mp4' 
      }, { quoted: ms, ptt: false });
    });

    fileStream.on('error', (error) => {
      console.error('Error while writing the audio file:', error);
      repondre('An error occurred while downloading the audio.');
    });

  } catch (error) {
    console.error('Error while searching or downloading the audio:', error);
    repondre('An error occurred while processing the audio download.');
  }
});
