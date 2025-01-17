const { zokou } = require('rk/zokou');
const moment = require('moment-timezone');
const { getBuffer } = require('rk/dl/Func');
const { default: axios } = require('axios');
const speed = require('performance-now');

// API key directly added in the code
const weatherApiKey = 'YOUR_API_KEY_HERE';

const uptimeToReadable = function (uptimeInSeconds) {
    const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s`;

    return result;
};

const getPerformanceMetrics = () => {
    const currentTime = speed();
    const executionTime = (speed() - currentTime).toFixed(3);
    return executionTime;
};

zokou({
    nomCom: 'uptime',
    desc: 'Returns the uptime of the bot in a readable format.',
    Categorie: 'Utility',
    reaction: '📡',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    const uptime = process.uptime();
    const uptimeStr = uptimeToReadable(uptime);
    await repondre(`${arg} Bot has been up for: ${uptimeStr}`);
});

zokou({
    nomCom: 'performance',
    desc: 'Shows bot performance metrics.',
    Categorie: 'Utility',
    reaction: '📊',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    const executionTime = getPerformanceMetrics();
    await repondre(`${arg} Bot performance execution time: ${executionTime} seconds`);
});

zokou({
    nomCom: 'screenshot',
    desc: 'Takes a screenshot of the current state of the bot or page.',
    Categorie: 'General',
    reaction: '📸',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    await repondre(`Taking a screenshot for ${arg}...`);
    // Logic to capture a screenshot would be here
});

zokou({
    nomCom: 'link',
    desc: 'Sends a URL link as a response.',
    Categorie: 'General',
    reaction: '🔗',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    await repondre(`Here is the link: ${arg}`);
});

zokou({
    nomCom: 'fetch',
    desc: 'Fetches the content from a URL and sends it back.',
    Categorie: 'Utility',
    reaction: '🔍',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    try {
        const response = await axios.get(arg);
        await repondre(`Fetched content from: ${arg}\nContent: ${response.data}`);
    } catch (error) {
        await repondre(`Error fetching the URL: ${error.message}`);
    }
});

zokou({
    nomCom: 'image',
    desc: 'Returns an image from a given search term.',
    Categorie: 'General',
    reaction: '🖼️',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    const searchTerm = arg || 'random image';
    const imageUrl = `https://source.unsplash.com/800x600/?${searchTerm}`;
    await repondre(`Here is a ${searchTerm} image: ${imageUrl}`);
});

zokou({
    nomCom: 'time',
    desc: 'Returns the current time in a specific timezone.',
    Categorie: 'Utility',
    reaction: '⏰',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    const timezone = arg || 'UTC';
    const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    await repondre(`Current time in ${timezone}: ${currentTime}`);
});

zokou({
    nomCom: 'weather',
    desc: 'Returns the current weather for a given location.',
    Categorie: 'Utility',
    reaction: '🌤️',
    fromMe: true
}, async (_from, _to, _message) => {
    const { arg, repondre } = _message;
    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${arg}&appid=${weatherApiKey}`);
        const weatherData = weatherResponse.data;
        const weatherInfo = `Weather in ${arg}:\n${weatherData.weather[0].description}\nTemperature: ${(weatherData.main.temp - 273.15).toFixed(2)}°C`;
        await repondre(weatherInfo);
    } catch (error) {
        await repondre(`Error fetching weather data: ${error.message}`);
    }
});