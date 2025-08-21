
require('./setting/settings');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");
const axios = require('axios');
const didyoumean = require('didyoumean');
const path = require('path');
const chalk = require("chalk");
const util = require("util");
const moment = require("moment-timezone");
const speed = require('performance-now');
const similarity = require('similarity');
const { spawn, exec, execSync } = require('child_process');

const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("@whiskeysockets/baileys");

module.exports = supreme = async (supreme, m, chatUpdate, store) => {
try {
// Message type handlers
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);

const sender = m.key.fromMe
? supreme.user.id.split(":")[0] || supreme.user.id
: m.key.participant || m.key.remoteJid;

const senderNumber = sender.split('@')[0];
const budy = (typeof m.text === 'string' ? m.text : '');
const prefa = ["", "!", ".", ",", "🐤", "🗿"];
const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '/';

// Buat Grup
const from = m.key.remoteJid;
const isGroup = from.endsWith("@g.us");

// Database And Lain"
const botNumber = await supreme.decodeJid(supreme.user.id);
const isBot = botNumber.includes(senderNumber);
const newOwner = fs.readFileSync("./lib/owner.json")
const isOwner = newOwner.includes(m.sender);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
const args = body.trim().split(/ +/).slice(1);
const pushname = m.pushName || "සමූහයේ කිසිඳු නමක් නැත";
const text = q = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const mime = (quoted.msg || quoted).mimetype || '';
const qmsg = (quoted.msg || quoted);
const isMedia = /image|video|sticker|audio/.test(mime);

// function Group
const groupMetadata = isGroup ? await supreme.groupMetadata(m.chat).catch((e) => {}) : "";
const groupOwner = isGroup ? groupMetadata.owner : "";
const groupName = m.isGroup ? groupMetadata.subject : "";
const participants = isGroup ? await groupMetadata.participants : "";
const groupAdmins = isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
const groupMembers = isGroup ? groupMetadata.participants : "";
const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

// My Func
const { 
smsg, 
sendGmail, 
formatSize, 
isUrl, 
generateMessageTag, 
getBuffer, 
getSizeMedia, 
runtime, 
fetchJson, 
sleep } = require('./lib/myfunc');

// fungsi waktu real time
const time = moment.tz("Asia/Jakarta").format("HH:mm:ss");

// Cmd in Console
if (m.message) {
console.log('\x1b[30m--------------------\x1b[0m');
console.log(chalk.bgHex("#e74c3c").bold(`➤ නවතම පණිවිඩය`));
console.log(
chalk.bgHex("#00FF00").black(
` ⭔  Time: ${new Date().toLocaleString()} \n` +
` ⭔  Message: ${m.body || m.mtype} \n` +
` ⭔  Body: ${m.pushname} \n` +
` ⭔  JID: ${senderNumber}`
)
);
if (m.isGroup) {
console.log(
chalk.bgHex("#00FF00").black(
` ▢  Grup: ${groupName} \n` +
` ▢  GroupJid: ${m.chat}`
)
);
}
console.log();
} 
//bug function 

const sound = { 
key: {
fromMe: false, 
participant: `120363419075720962@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) 
},
"message": {
"audioMessage": {
"url": "https://mmg.whatsapp.net/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172&mms3=true",
"mimetype": "audio/mp4",
"fileSha256": "oZeGy+La3ZfKAnQ1epm3rbm1IXH8UQy7NrKUK3aQfyo=",
"fileLength": "1067401",
"seconds": 9999999999999,
"ptt": true,
"mediaKey": "PeyVe3/+2nyDoHIsAfeWPGJlgRt34z1uLcV3Mh7Bmfg=",
"fileEncSha256": "TLOKOAvB22qIfTNXnTdcmZppZiNY9pcw+BZtExSBkIE=",
"directPath": "/v/t62.7114-24/56189035_1525713724502608_8940049807532382549_n.enc?ccb=11-4&oh=01_AdR7-4b88Hf2fQrEhEBY89KZL17TYONZdz95n87cdnDuPQ&oe=6489D172",
"mediaKeyTimestamp": "1684161893"
}}}


const qkontak = {
key: {
participant: `0@s.whatsapp.net`,
...(botNumber ? {
remoteJid: `status@broadcast`
} : {})
},
message: {
'contactMessage': {
'displayName': `${global.namaown}`,
'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=94726800969:+94781973314\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
sendEphemeral: true
}}
}

const reply = (teks) => {
supreme.sendMessage(from, { text : teks }, { quoted : m })
}

const reaction = async (jidss, emoji) => {
supreme.sendMessage(jidss, { react: { text: emoji, key: m.key }})}

if (autoread) {
  supreme.readMessages([m.key]);
}

if (global.autoTyping) {
  supreme.sendPresenceUpdate("composing", from);
}

if (global.autoRecording) {
  supreme.sendPresenceUpdate("recording", from);
}

supreme.sendPresenceUpdate("unavailable", from);

if (global.autorecordtype) {
  let xeonRecordTypes = ["recording", "composing"];
  let selectedRecordType = xeonRecordTypes[Math.floor(Math.random() * xeonRecordTypes.length)];
  supreme.sendPresenceUpdate(selectedRecordType, from);
}

if (autobio) {
  supreme.updateProfileStatus(` NIMA V5 මෙ වෙලාවෙ online පටන් ගෙන දැන් ${runtime(process.uptime())}`)
    .catch(err => console.error("Error updating status:", err));
}

if (m.sender.startsWith("92") && global.anti92 === true) {
  return supreme.updateBlockStatus(m.sender, "block");
}

if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(global.owner + "@s.whatsapp.net")) {
  if (!m.quoted) {
    reply("නිමේෂ / මගේ admin මෙ වෙලාවෙ offline. ටිකක් ඉන්න");
    setTimeout(() => {
      supreme.sendMessage(m.key.remoteJid, { delete: m.key });
    }, 2000);
  }
}

if (global.owneroff) {
  if (!isGroup && !isOwner) {
    let text = `නිමේෂ / මගේ admin මෙ වෙලාවෙ offline, online ආවම එයාට කතා කරන්න 😇`
    return supreme.sendMessage(m.chat, {
      text: `${text}`,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          thumbnailUrl: ":" ,               
          renderLargerThumbnail: false,
          title: "https://files.catbox.moe/w9lv7j.jpg",
          renderLargerThumbnail: false,
          title: "｢ නිමේෂ / admin දැන් offline ｣",
          mediaUrl: global.channel,
          sourceUrl: global.linkyt,
          previewType: "PHOTO"
        }
      }
    }, { quoted: m });
  }
}
switch (command) {        
case "public": { 
if (!isBot) return reply(`සමාවෙන්න. එය නිමේෂට පමණක් විවෘත උනු විධානයකිි`)
supreme.public = true
reply(`හරී. මන් දැන් හැමදෙනාටම පොදු රොබෝවෙක්`)
}
break;
//////////////////self//////////////////
case "self":
case "private": { 
if (!isBot) return reply(`Feature for owner only`)
supreme.public = false
reply(`හරී මන් දැන් පෞද්ගලික රොබෝවෙක්`)
}
break;
        
////autotyping
        case 'autotyping':
                if (!isBot) return reply(mess.owner)
        
                if (args.length < 1) return reply(`උදාහරණ ${prefix + command} on/off`)
        
                if (q === 'on') {

                    autoTyping = true

                    reply(`හරී auto-typing  ${q} on උනා`)

                } else if (q === 'off') {

                    autoTyping = false

                    reply(`හරී auto-typing ${q} off උනා`)

                }

                break
//////////////////autorecording/////////////////////
        case 'autorecording':
                
                if (!isBot) return reply(mess.owner)
                if (args.length < 1) return reply(`උදාහරණ ${prefix + command} on/off`)
                if (q === 'on') {
                    autoRecording = true

                    reply(`හරී auto-recording ${q} on උනා`)

                } else if (q === 'off') {

                    autoRecording = false

                    reply(`හරී auto-recording ${q} off උනා `)

                }

                break;
/////////////////autoread/////////////////
        case 'autoread': 

  if (!isBot) return reply(mess.owner)
  if (args.length < 1) return reply(`උදාහරණ ${prefix + command} on/off`)
  if (q === 'on') {
    autoread = true
    reply(`හරී auto-read ${q} on උනා`)
  } else if (q === 'off') {
    autoread = false
    reply(`හරී auto-read ${q} off උනා`)
  }
  break;
///////////////////GITCLONE//////////////  
    case 'gitclone': {

		      if (!text) return m.reply(`🖇️ github ලින්ක් එක.\n *උදාහරණ: .gitclone https://github.com/nimanew303/NIMA-V5-new`)

if (!text.includes('github.com')) return reply(`මොකක්ද ඕන github ලිංකුව ?!`)

let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

    let [, user3, repo] = text.match(regex1) || []

    repo = repo.replace(/.git$/, '')

    let url = `https://api.github.com/repos/${user3}/${repo}/zipball`

    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]

    await supreme.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply("error"))

		    }

		      break;      
//////////////runtime///////////////////////
    case 'runtime': {
      m.reply(`🔸 *${runtime(process.uptime())}*`)
    }

    break;
/////////////////////////////////////////
 case 'autobio':
  if (!isBot) return reply(mess.owner)
  if (args.length < 1) return reply(`උදාහරණ ${prefix + command} on/off`)
  if (q === 'on') {
    autobio = true
    reply(`හරී Auto-bio  ${q} on උනා`)
  } else if (q === 'off') {
    autobio = false
    reply(`හරී Auto-bio  ${q} off උනා`)
  }
  break   
        
//////////////////////////////////////////
   case 'setprefix':
                if (!isBot) return reply (mess.owner)
                if (!text) return reply(`උදාහරණ : ${prefix + command} desired prefix`)
                global.prefix = text
                reply(`හරී Prefix  ${text} විදිහට change උනා`)
                break;
        ////////////////////////////////////////

		
case 'play':{
const axios = require('axios');
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

  try {
    if (!text) return m.reply("මොකක්ද ඔයාට ඕන සින්දුව 🙄?");

    let search = await yts(text);
    let link = search.all[0].url;

    const apis = [
      `https://xploader-api.vercel.app/ytmp3?url=${link}`,
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${link}`
       ];

    for (const api of apis) {
      try {
        let data = await fetchJson(api);

        // Checking if the API response is successful
        if (data.status === 200 || data.success) {
          let videoUrl = data.result?.downloadUrl || data.url;
          let outputFileName = `${search.all[0].title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
          let outputPath = path.join(__dirname, outputFileName);

          const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
          });

          if (response.status !== 200) {
            m.reply("සමාවෙන්න. api වල error එකක්. මෙ දවස් වල නිමේෂ මේක හදමින් ඉන්නෙ. මම හිතන්නෙ තාම බැරි වෙන්න ඈති. පස්සෙ උත්සහ කරල බලන්න සමහර විට හරියයි");
            continue;
          }
		ffmpeg(response.data)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", async () => {
              await supreme.sendMessage(
                m.chat,
                {
                  document: { url: outputPath },
                  mimetype: "audio/mp3",
		  caption: " *NIMA-V5* ",
                  fileName: outputFileName,
                },
                { quoted: m }
              );
              fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
              m.reply("බා ගැනීම අසාර්ථකයි\n" + err.message);
            });

          return;
        }
      } catch (e) {
        // Continue to the next API if one fails
        continue;
      }
   }

    // If no APIs succeeded
    m.reply("වැරදි api කේතයකි. නිවැරදිදැයි සොයා බලා නැවත උත්සහ කරන්න.");
  } catch (error) {
    m.reply("බා ගැනීම අසාර්ථකයි\n" + error.message);
  }
}
	  break;
///////////////////////////////////////    
        
        ///////////////////////////////////////////       
default:
if (budy.startsWith('>')) {
if (!isOwner) return;
try {
let evaled = await eval(budy.slice(2));
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
await m.reply(evaled);
} catch (err) {
m.reply(String(err));
}
}

if (budy.startsWith('<')) {
if (!isOwner) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await m.reply(require('util').format(teks))
}
}

}
} catch (err) {
console.log(require("util").format(err));
}
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file);
console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
delete require.cache[file];
require(file);
});
