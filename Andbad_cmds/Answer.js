// Global error handler to catch any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const { zokou } = require("../framework/zokou");
const { default: axios } = require("axios");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;

///////////////////////////////////////////////////////////////////////////////
// Command: checknum
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Command: number - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: technews - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: pair - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: mail
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "mail",
  'aliases': ['tempmail', 'temp'],
  'reaction': '📧',
  'categorie': "General"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  try {
    const randomId = Math.random().toString(36).substring(2, 12);
    const emailAddress = randomId + "@1secmail.com";
    await zk.sendMessage(dest, {
      text: "Your temporary email is: " + emailAddress +
        "\n\nYou can use this email for temporary purposes. I will notify you if you receive any emails."
    }, { quoted: ms });
    
    const extractLinks = (text) => {
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(linkRegex);
    };
    
    const checkEmail = async () => {
      try {
        const response = await fetch("https://www.1secmail.com/api/v1/?action=getMessages&login=" + randomId + "&domain=1secmail.com");
        const messages = await response.json();
        if (messages && messages.length > 0) {
          for (const message of messages) {
            const messageResponse = await fetch("https://www.1secmail.com/api/v1/?action=readMessage&login=" + randomId + "&domain=1secmail.com&id=" + message.id);
            const messageData = await messageResponse.json();
            const links = extractLinks(messageData.textBody);
            const linksText = links ? links.join("\n") : "No links found in the email content.";
            await zk.sendMessage(dest, {
              text: "You have received a new email!\n\nFrom: " + messageData.from +
                "\nSubject: " + messageData.subject + "\n\n" + messageData.textBody +
                "\n\nLinks found:\n" + linksText
            }, { quoted: ms });
          }
        }
      } catch (error) {
        console.error("Error checking temporary email:", error.message);
      }
    };
    
    const checkInterval = setInterval(checkEmail, 30000);
    setTimeout(() => {
      clearInterval(checkInterval);
      zk.sendMessage(dest, {
        text: "Your temporary email session has ended. Please create a new temporary email if needed."
      }, { quoted: ms });
    }, 600000);
  } catch (error) {
    console.error("Error generating temporary email:", error.message);
    await zk.sendMessage(dest, {
      text: "Error generating temporary email. Please try again later."
    }, { quoted: ms });
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: gpt2 - REMOVED (API broken, use .gpt instead)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: dalle - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: gpt
///////////////////////////////////////////////////////////////////////////////
zokou({ nomCom: "gpt", reaction: "🤔", categorie: "IA" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  try {
    if (!arg || arg.length === 0) {
      return repondre(`Please ask a question.`);
    }
    const question = arg.join(' ');
    const response = await axios.get(`https://api.gurusensei.workers.dev/llama?prompt=${question}`);
    const data = response.data;
    if (data) {
      repondre(data.result);
    } else {
      repondre("Error during response generation.");
    }
  } catch (error) {
    console.error('gpt error:', error.message || 'An error occurred');
    repondre("Oops, an error occurred while processing your request.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: gemini
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "gemini",
  'reaction': '🤗',
  'categorie': 'AI'
}, async (_0x266164, _0x1eb32c, _0x2c2713) => {
  const { repondre: _0x5e569a, arg: _0xea7c04 } = _0x2c2713;
  try {
    if (!_0xea7c04 || _0xea7c04.length === 0) {
      return _0x5e569a("Hello am *FLASH-MD.* an AI developed by ✞𓊈𒆜  𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𒆜𓊉 ✞.\n\n What help can I offer you today?");
    }
    const _0x1a05b7 = _0xea7c04.join(" ");
    // Try alternative Gemini API
    let _0x1665a8 = await fetch('https://widipe.com/gemini?text=' + _0x1a05b7);
    if (!_0x1665a8.ok) {
      // Fallback to alternative
      _0x1665a8 = await fetch('https://api.gurusensei.workers.dev/gemini?prompt=' + encodeURIComponent(_0x1a05b7));
      if (!_0x1665a8.ok) throw new Error("Gemini API error");
    }
    const _0x449374 = await _0x1665a8.json();
    if (_0x449374 && _0x449374.result) {
      const _0x17c283 = _0x449374.result;
      const _0x2c0cf9 = _0x17c283.match(/```([\s\S]*?)```/);
      const _0x4f713e = [{
        'name': "cta_url",
        'buttonParamsJson': JSON.stringify({
          'display_text': "SUBSCRIBE 🤍 CHANNEL",
          'url': "https://www.youtube.com/@Encrypto27"
        })
      }];
      if (_0x2c0cf9) {
        const _0x36bcc4 = _0x2c0cf9[1];
        _0x4f713e.unshift({
          'name': 'cta_copy',
          'buttonParamsJson': JSON.stringify({
            'display_text': "📋 COPY YOUR CODE",
            'id': "copy_code",
            'copy_code': _0x36bcc4
          })
        });
        const _0x4efcb4 = generateWAMessageFromContent(_0x266164, {
          'viewOnceMessage': {
            'message': {
              'messageContextInfo': { 'deviceListMetadata': {}, 'deviceListMetadataVersion': 2 },
              'interactiveMessage': proto.Message.InteractiveMessage.create({
                'body': proto.Message.InteractiveMessage.Body.create({ 'text': _0x17c283 }),
                'footer': proto.Message.InteractiveMessage.Footer.create({ 'text': "> *POWERED BY ANDBAD*" }),
                'header': proto.Message.InteractiveMessage.Header.create({ 'title': '', 'subtitle': '', 'hasMediaAttachment': false }),
                'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({ 'buttons': _0x4f713e })
              })
            }
          }
        }, {});
        await _0x1eb32c.relayMessage(_0x266164, _0x4efcb4.message, { 'messageId': _0x4efcb4.key.id });
      } else {
        const _0x156368 = generateWAMessageFromContent(_0x266164, {
          'viewOnceMessage': {
            'message': {
              'messageContextInfo': { 'deviceListMetadata': {}, 'deviceListMetadataVersion': 2 },
              'interactiveMessage': proto.Message.InteractiveMessage.create({
                'body': proto.Message.InteractiveMessage.Body.create({ 'text': _0x17c283 }),
                'footer': proto.Message.InteractiveMessage.Footer.create({ 'text': "> *POWERED BY ✞𓊈𒆜  𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𒆜𓊉 ✞*" }),
                'header': proto.Message.InteractiveMessage.Header.create({ 'title': '', 'subtitle': '', 'hasMediaAttachment': false }),
                'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({ 'buttons': _0x4f713e })
              })
            }
          }
        }, {});
        await _0x1eb32c.relayMessage(_0x266164, _0x156368.message, { 'messageId': _0x156368.key.id });
      }
    } else {
      throw new Error("Invalid response from the API.");
    }
  } catch (_0x545d02) {
    console.error("gemini error:", _0x545d02.message);
    _0x5e569a("Error getting response.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: calc (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "calc",
  'aliases': ["cal", "calculate"],
  'reaction': '🔢',
  'categorie': "General"
}, async (_0x5921a6, _0x2e3a02, _0x54cc6d) => {
  const { repondre: _0x42ce14, arg: _0x3c1020 } = _0x54cc6d;
  try {
    if (!_0x3c1020 || _0x3c1020.length === 0) {
      return _0x42ce14("Please insert math calculations like 100000+2024.\n\nNOTE: Use \"(/)\" for division and \"(*)\" for multiplication or letter x");
    }
    const _0xa0ab30 = _0x3c1020.join(" ");
    // Try alternative calculator API
    let _0x6127e3 = await fetch("https://api.mathjs.org/v4/?expr=" + encodeURIComponent(_0xa0ab30));
    if (!_0x6127e3.ok) {
      // Fallback to original
      _0x6127e3 = await fetch("https://api.maher-zubair.tech/ai/mathssolve?q=" + _0xa0ab30);
      if (!_0x6127e3.ok) throw new Error("Failed to fetch calculation result.");
      const _0xa91128 = await _0x6127e3.json();
      await _0x42ce14(_0xa91128.result);
    } else {
      const result = await _0x6127e3.text();
      await _0x42ce14(result);
    }
    console.log(_0xa91128.completion);
  } catch (error) {
    console.error("calc command error:", error.message);
    await _0x42ce14("Error processing math calculation. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: best-wallp (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "best-wallp",
  'aliases': ['bestwal', "best", 'bw'],
  'reaction': '🙌',
  'categorie': "PICS"
}, async (_0x163980, _0x17dc05, _0x2ec021) => {
  const { repondre: _0xb20711, ms: _0x169974 } = _0x2ec021;
  try {
    const _0x1c95dd = await fetch("https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc");
    if (!_0x1c95dd.ok) throw new Error("Failed to fetch image.");
    const _0x5d5bc4 = await _0x1c95dd.json();
    const _0x4353fb = _0x5d5bc4.urls.regular;
    let _0x492d96 = {
      'image': { 'url': _0x4353fb },
      'caption': "*POWERED BY ✞𓊈𒆜 _𝐊𝐘𝚸𝚮𝚵𝚪_XMD𒆜𓊉 ✞*"
    };
    await _0x17dc05.sendMessage(_0x163980, _0x492d96, { 'quoted': _0x169974 });
  } catch (error) {
    console.error("best-wallp error:", error.message);
    await _0xb20711("Error fetching wallpaper. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: random (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "random",
  'reaction': '🥂',
  'categorie': "PICS"
}, async (_0x22529c, _0x1dbc66, _0x20d62d) => {
  const { repondre: _0xe28fec, ms: _0x22b058 } = _0x20d62d;
  try {
    const _0x61dcc3 = await fetch('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
    if (!_0x61dcc3.ok) throw new Error("Failed to fetch image.");
    const _0x58610f = await _0x61dcc3.json();
    const _0x16084b = _0x58610f.urls.regular;
    let _0x1870da = {
      'image': { 'url': _0x16084b },
      'caption': "*POWERED BY ✞𓊈𒆜  𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𒆜𓊉 ✞*"
    };
    await _0x1dbc66.sendMessage(_0x22529c, _0x1870da, { 'quoted': _0x22b058 });
  } catch (error) {
    console.error("random command error:", error.message);
    await _0xe28fec("Error fetching random image. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: nature (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "nature",
  'reaction': '🦗',
  'categorie': "PICS"
}, async (_0x46a77f, _0x517574, _0x500ffb) => {
  const { repondre: _0x133c43, ms: _0x121316 } = _0x500ffb;
  try {
    const _0x3168c1 = await fetch('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
    if (!_0x3168c1.ok) throw new Error("Failed to fetch image.");
    const _0x753750 = await _0x3168c1.json();
    const _0x37756c = _0x753750.urls.regular;
    let _0x2df8b4 = {
      'image': { 'url': _0x37756c },
      'caption': "*POWERED BY ✞𓊈𒆜  𝔼ℕℂℝ𝕐ℙ𝕋𝕆-𝟚𝟟 𒆜𓊉 ✞*"
    };
    await _0x517574.sendMessage(_0x46a77f, _0x2df8b4, { 'quoted': _0x121316 });
  } catch (error) {
    console.error("nature command error:", error.message);
    await _0x133c43("Error fetching nature image. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: time
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "time",
  'aliases': ["now", "live", "moment"],
  'reaction': '⌚',
  'categorie': "General"
}, async (_0xb00379, _0x5206a1, _0x335312) => {
  const { repondre: _0x10e76d, arg: _0x11f077 } = _0x335312;
  try {
    if (!_0x11f077 || _0x11f077.length === 0) {
      return _0x10e76d("Enter the name of the country you want to know its time and date");
    }
    const _0x54401d = _0x11f077.join(" ");
    const _0x92fada = await fetch("https://levanter.onrender.com/time?code=" + _0x54401d);
    if (!_0x92fada.ok) throw new Error("Failed to fetch time data.");
    const _0x23f003 = await _0x92fada.json();
    const _0x129939 = _0x23f003.result[0].name;
    const _0x38f95e = _0x23f003.result[0].time;
    const _0x3332e9 = _0x23f003.result[0].timeZone;
    await _0x10e76d("Live Time in *" + _0x129939 + "* Stats:\n\n*Date & Time:* " + _0x38f95e + "\n*TimeZone:* " + _0x3332e9 + "\n\n> *POWERED BY ANDBAD-MD*");
  } catch (error) {
    console.error("time command error:", error.message);
    _0x10e76d("That country name is incorrect!");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: lines (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "lines",
  'reaction': '🫵',
  'categorie': "Fun"
}, async (_0x57baf4, _0x1f839f, _0x52b256) => {
  const { repondre: _0x4d8435 } = _0x52b256;
  try {
    // Try alternative API for lines/pickup lines
    let _0x1f27e0 = await fetch("https://api.popcat.xyz/pickuplines");
    if (!_0x1f27e0.ok) {
      // Fallback
      _0x1f27e0 = await fetch("https://api.maher-zubair.tech/misc/lines");
      if (!_0x1f27e0.ok) throw new Error("Failed to fetch lines.");
    }
    const _0x3ec766 = await _0x1f27e0.json();
    await _0x4d8435(_0x3ec766.pickupline || _0x3ec766.result || _0x3ec766);
    console.log(_0x3ec766.completion);
  } catch (error) {
    console.error("lines command error:", error.message);
    await _0x4d8435("Error fetching lines. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: insult (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "insult",
  'reaction': '💀',
  'categorie': 'Fun'
}, async (_0x7345fc, _0x4f2a4b, _0x2ebea8) => {
  const { repondre: _0x50c4be } = _0x2ebea8;
  try {
    // Try alternative API first
    let response = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json");
    if (!response.ok) {
      // Fallback to another API
      response = await fetch("https://insult.mattbas.org/api/insult");
      if (!response.ok) throw new Error("Failed to fetch insult.");
      const text = await response.text();
      await _0x50c4be(text);
    } else {
      const data = await response.json();
      await _0x50c4be(data.insult || data.result || "You're not worth insulting!");
    }
  } catch (error) {
    console.error("insult command error:", error.message);
    await _0x50c4be("Error fetching insult. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: enhance - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: dare (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': 'dare',
  'reaction': '😁',
  'categorie': "Fun"
}, async (_0x441810, _0x49f70e, _0x5560e8) => {
  const { repondre: _0x14aa8f } = _0x5560e8;
  try {
    const _0x5ce1af = await fetch("https://shizoapi.onrender.com/api/texts/dare?apikey=shizo");
    if (!_0x5ce1af.ok) throw new Error("Failed to fetch dare.");
    const _0x197195 = await _0x5ce1af.json();
    await _0x14aa8f(_0x197195.result);
    console.log(_0x197195.completion);
  } catch (error) {
    console.error("dare command error:", error.message);
    await _0x14aa8f("Error fetching dare. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: truth (updated with error handling)
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "truth",
  'reaction': '🤩',
  'categorie': 'Fun'
}, async (_0x52257e, _0x544d31, _0x279cb5) => {
  const { repondre: _0x42fdef } = _0x279cb5;
  try {
    const _0x57946c = await fetch('https://shizoapi.onrender.com/api/texts/truth?apikey=shizo');
    if (!_0x57946c.ok) throw new Error("Failed to fetch truth.");
    const _0x27a10a = await _0x57946c.json();
    await _0x42fdef(_0x27a10a.result);
    console.log(_0x27a10a.completion);
  } catch (error) {
    console.error("truth command error:", error.message);
    await _0x42fdef("Error fetching truth. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: applenews - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: nasanews
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': 'nasanews',
  'reaction': "🗞️",
  'categorie': 'NEWS'
}, async (_0x35ed94, _0x4cf3db, _0x329470) => {
  const { repondre: _0x137d3b, ms: _0x85e6ab } = _0x329470;
  try {
    // Try NASA API directly
    let _0x1fd2f2 = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    if (!_0x1fd2f2.ok) {
      // Fallback to original
      _0x1fd2f2 = await fetch("https://api.maher-zubair.tech/details/nasa");
      if (!_0x1fd2f2.ok) throw new Error("Failed to fetch NASA news.");
      const _0x519fed = await _0x1fd2f2.json();
      if (_0x519fed && _0x519fed.status === 200 && _0x519fed.result) {
        const _0x25ee7e = _0x519fed.result;
        const _0x500db0 = "\n* NASA NEWS:*\n\n\n- *Title:* " + _0x25ee7e.title +
          "\n\n- *Date:* " + _0x25ee7e.date +
          "\n\n- *Description:* " + _0x25ee7e.explanation.split("\n")[0] +
          "...\n\n\n> Powered by *©ENCRYPTO27 MD*";
        const _0x223fd9 = _0x25ee7e.url;
        if (_0x223fd9) {
          await _0x4cf3db.sendMessage(_0x35ed94, {
            'image': { 'url': _0x223fd9 },
            'caption': _0x500db0.trim()
          }, { 'quoted': _0x85e6ab });
        } else {
          await _0x4cf3db.sendMessage(_0x35ed94, { 'text': _0x500db0.trim() }, { 'quoted': _0x85e6ab });
        }
        return;
      }
    }
    const _0x519fed = await _0x1fd2f2.json();
    if (_0x519fed && _0x519fed.status === 200 && _0x519fed.result) {
      const _0x25ee7e = _0x519fed.result;
      const _0x500db0 = "\n* NASA NEWS:*\n\n\n- *Title:* " + _0x25ee7e.title +
        "\n\n- *Date:* " + _0x25ee7e.date +
        "\n\n- *Description:* " + _0x25ee7e.explanation.split("\n")[0] +
        "...\n\n\n> Powered by *©ANDBAD*";
      const _0x223fd9 = _0x25ee7e.url;
      if (_0x223fd9) {
        await _0x4cf3db.sendMessage(_0x35ed94, {
          'image': { 'url': _0x223fd9 },
          'caption': _0x500db0.trim()
        }, { 'quoted': _0x85e6ab });
      } else {
        await _0x4cf3db.sendMessage(_0x35ed94, { 'text': _0x500db0.trim() }, { 'quoted': _0x85e6ab });
      }
    } else {
      await _0x137d3b("No news data found.");
    }
  } catch (error) {
    console.error("nasanews error:", error.message);
    await _0x137d3b("There was an error fetching the news. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: population - REMOVED (API broken, no working alternative found)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Command: jokes
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': 'jokes',
  'reaction': '🤩',
  'categorie': "Fun"
}, async (_0x34ca3d, _0x261a9b, _0x1033a6) => {
  const { repondre: _0x2fa695 } = _0x1033a6;
  try {
    const _0xb540d6 = await fetch("https://api.popcat.xyz/joke");
    if (!_0xb540d6.ok) throw new Error("Failed to fetch joke.");
    const _0x559bd6 = await _0xb540d6.json();
    await _0x2fa695(_0x559bd6.joke);
    console.log(_0x559bd6.joke);
  } catch (error) {
    console.error("jokes error:", error.message);
    await _0x2fa695("Failed to fetch a joke. Please try again later.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: advice
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "advice",
  'reaction': "🗨️",
  'categorie': "Fun"
}, async (_0xa2de23, _0x27275c, _0x1bc249) => {
  const { repondre: _0x39478b } = _0x1bc249;
  try {
    const _0xe783d7 = await fetch("https://api.adviceslip.com/advice");
    if (!_0xe783d7.ok) throw new Error("Failed to fetch advice.");
    const _0x100640 = await _0xe783d7.json();
    const _0x2f9050 = _0x100640.slip.advice;
    await _0x39478b("*Here is an advice for you:* \n" + _0x2f9050);
  } catch (error) {
    console.error("advice error:", error.message);
    _0x39478b("Oops, an error occurred while processing your request");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: trivia
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "trivia",
  'reaction': '🤔',
  'categorie': 'Fun'
}, async (_0x3204f7, _0x204d8e, _0x88bd02) => {
  const { repondre: _0x579330, ms: _0x2a0f96 } = _0x88bd02;
  try {
    const _0x5759c9 = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
    if (_0x5759c9.status !== 200) {
      return _0x579330("Invalid response from the trivia API. Status code: " + _0x5759c9.status);
    }
    const _0x5ea735 = await _0x5759c9.json();
    if (_0x5ea735 && _0x5ea735.results && _0x5ea735.results[0]) {
      const _0x282619 = _0x5ea735.results[0];
      const _0x347101 = _0x282619.question;
      const _0x327083 = _0x282619.correct_answer;
      const _0x539989 = [..._0x282619.incorrect_answers, _0x327083].sort();
      const _0x91ed12 = _0x539989.map((ans, idx) => (idx + 1) + ". " + ans).join("\n");
      await _0x204d8e.sendMessage(_0x3204f7, {
        'text': "Here's a trivia question for you: \n\n" + _0x347101 + "\n\n" + _0x91ed12 + "\n\nI will send the correct answer in 10 seconds..."
      }, { 'quoted': _0x2a0f96 });
      setTimeout(async () => {
        await _0x204d8e.sendMessage(_0x3204f7, {
          'text': "The correct answer is: " + _0x327083
        }, { 'quoted': _0x2a0f96 });
      }, 10000);
    } else {
      throw new Error("Invalid response format from the trivia API.");
    }
  } catch (error) {
    console.error("trivia error:", error.message);
    await _0x204d8e.sendMessage(_0x3204f7, {
      'text': "Error getting trivia. Please try again later."
    }, { 'quoted': _0x2a0f96 });
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: inspire
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "inspire",
  'reaction': '✨',
  'categorie': "General"
}, async (_0x4045c5, _0x5ba7da, _0x15450e) => {
  const { repondre: _0x36323f } = _0x15450e;
  try {
    const _0x5e67cb = await fetch("https://type.fit/api/quotes");
    if (!_0x5e67cb.ok) throw new Error("Failed to fetch inspirational quotes.");
    const _0x3e14ca = await _0x5e67cb.json();
    const _0x131cb9 = Math.floor(Math.random() * _0x3e14ca.length);
    const _0x472c18 = _0x3e14ca[_0x131cb9];
    await _0x36323f("*Here is an inspirational quote for you:* \n\"" + _0x472c18.text + "\" - " + _0x472c18.author);
  } catch (error) {
    console.error("inspire error:", error.message);
    _0x36323f("Oops, an error occurred while processing your request");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: gpt4
///////////////////////////////////////////////////////////////////////////////
zokou({
  'nomCom': "gpt4",
  'reaction': '📡',
  'categorie': 'AI'
}, async (_0xc0c6a0, _0x46f59f, _0x4455ed) => {
  const { repondre: _0x5488f8, arg: _0x5610c3 } = _0x4455ed;
  try {
    if (!_0x5610c3 || _0x5610c3.length === 0) {
      return _0x5488f8("Please ask a question.");
    }
    const _0x1c4393 = encodeURIComponent(_0x5610c3.join(" "));
    // Try alternative GPT4 API
    let _0x320c11 = "https://samirxpikachuio.onrender.com/gpt?content=" + _0x1c4393;
    try {
      const _0x2913f8 = await axios.get(_0x320c11, { timeout: 15000 });
      const _0x823fc2 = _0x2913f8.data;
    if (_0x823fc2 && _0x823fc2.message && _0x823fc2.message.content) {
      const _0x790fb0 = _0x823fc2.message.content;
      const _0x46fe6a = _0x790fb0.match(/```([\s\S]*?)```/);
      const _0x16ed68 = [{
        'name': "cta_url",
        'buttonParamsJson': JSON.stringify({
          'display_text': "FOLLOW 🤍 CHANNEL",
          'url': 'https://whatsapp.com/channel/'
        })
      }];
      if (_0x46fe6a) {
        const _0x5b3b89 = _0x46fe6a[1];
        _0x16ed68.unshift({
          'name': "cta_copy",
          'buttonParamsJson': JSON.stringify({
            'display_text': "📋 COPY RESULTS",
            'id': 'copy_code',
            'copy_code': _0x5b3b89
          })
        });
      }
      const _0x8338c9 = generateWAMessageFromContent(_0xc0c6a0, {
        'viewOnceMessage': {
          'message': {
            'messageContextInfo': { 'deviceListMetadata': {}, 'deviceListMetadataVersion': 2 },
            'interactiveMessage': proto.Message.InteractiveMessage.create({
              'body': proto.Message.InteractiveMessage.Body.create({ 'text': _0x790fb0 }),
              'footer': proto.Message.InteractiveMessage.Footer.create({ 'text': "> *POWERED BY ANDABAD*" }),
              'header': proto.Message.InteractiveMessage.Header.create({ 'title': '', 'subtitle': '', 'hasMediaAttachment': false }),
              'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({ 'buttons': _0x16ed68 })
            })
          }
        }
      }, {});
      await _0x46f59f.relayMessage(_0xc0c6a0, _0x8338c9.message, { 'messageId': _0x8338c9.key.id });
    } else {
      throw new Error("Invalid response format from the GPT API.");
    }
  } catch (_0x2bb69a) {
    console.error("gpt4 error:", _0x2bb69a.message, _0x2bb69a.response?.["data"] || "No additional data");
    _0x5488f8("Error getting response from GPT.");
  }
});

///////////////////////////////////////////////////////////////////////////////
// Command: bard - REMOVED (API broken, use .gemini or .gpt instead)
///////////////////////////////////////////////////////////////////////////////
