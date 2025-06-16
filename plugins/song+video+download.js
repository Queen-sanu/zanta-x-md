const config = require('../config')
const puppeteer = require('puppeteer');
const dl = require('@bochilteam/scraper')  
const yts = require("yt-search")
const l = console.log
const fs = require('fs-extra')
const fg = require('api-dylux');


var videotime = 60000 // 1000 min
function ytreg(url) {
    const ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
    return ytIdRegex.test(url);
}

const {
    smsg,
    getBuffer,
    getGroupAdmins,
    getRandom,
    getsize,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions')
const {
    cmd,
    commands
} = require('../command')



let currentPollIndex = 0;
let ytsOptionIndex = 1;
const ytsSearchResults = new Map();
let props;
const audioSearchResults = new Map();
let optionIndex = 1;
let index = 1;
const videoSearchResults = new Map();
let titleUrlMap = {}; 
const userContextMap = new Map();


function formatUploadDate(uploadDate) {
  const date = new Date(uploadDate);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}





var descv =''
if(config.LANG === 'SI') descv = "Youtube වෙතින් videos බාගත කරයි."
else descv = "Download videos from Youtube."

var descs =''
if(config.LANG === 'SI') descs = "Youtube වෙතින් songs බාගත කරයි."
else descs = "Download songs from Youtube."

var descyt =''
if(config.LANG === 'SI') descyt = "Youtube වෙතින් video සහ songs බාගත කරයි."
else descyt = "Download videos and songs from Youtube."

var descsh =''
if(config.LANG === 'SI') descsh = "Youtube search බාගත කරයි."
else descsh = "Search and get details from youtube."

var N_FOUND =''
if(config.LANG === 'SI') N_FOUND = "*Youtube හි ඔබ තේරු quality එක නැත වෙන quality එකක් තෝරන්න :(*"
else N_FOUND = "*I couldn't find anything :(*"

var urlneed =''
if(config.LANG === 'SI') urlneed = "*කරුණාකර Youtube url එකක් ලබා දෙන්න*"
else urlneed = "*Please give me youtube url..*"

var urlneed1 =''
if(config.LANG === 'SI') urlneed1 = "එය soundcloud වෙතින් songs බාගත කරයි."
else urlneed1 = "It downloads songs from soundcloud."

var imgmsg =''
if(config.LANG === 'SI') imgmsg = "```කරුණාකර වචන කිහිපයක් ලියන්න!```"
else imgmsg = "```Please write a few words!```"

var sizetoo =''
if(config.LANG === 'SI') sizetoo = "_This file size is too big_\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​  *මෙම file එක upload කිරීමට මෙම bot host වෙන platform එකේ bandwith එක ප්‍රමානවත් නැත !*"
else sizetoo =  "_This file size is too big_\n​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​ *The bandwidth of the platform where this bot is hosted is not enough to upload this file!*"


//---------------------------------------------------------------------------



cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts <name>',
    react: "🍁",
    desc: 'Search videos from youtube',
    category: "search",
    filename: __filename

},

    async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return await reply('*_Please enter a query to search!_*')
            var result = await yts(q);
            var msg = '';
            result.videos.map((video) => {
                msg += ' _✔️' + video.title + '_\n🔗 ' + video.url + '\n\n'
            });
            await conn.sendMessage(from, { text: msg }, { quoted: mek })
        } catch (e) {
            reply('ɪᴀᴍ ꜱᴏʀʀʏ ꜱᴀʀ ᴇʀʀᴏ 😪')
            l(e)
        }
    });




          
cmd({
    pattern: "video",
    alias: ["ytmp4"],
    use: '.video <name>',
    react: "🍁",
    desc: 'Download videos from youtube',
    category: "download",
    filename: __filename

},

    async (conn, m, mek, { from, q, reply }) => {
        try {
            if (!q) return await reply('*Please enter a query or a url!*')
            const url = q.replace(/\?si=[^&]*/, '');
            var results = await yts(url);
            var result = results.videos[0]
            const msg = `───────────────────
🍁 𝗬𝗧 𝗠𝗣3 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🍁
───────────────────

╭─────────────────╮
│✘ *🍁 ᴛɪᴛʟᴇ* :- ${result.title}
│✘*🍁 ᴠɪᴇᴡꜱ* :- ${result.views}
│✘ *🍁 ᴅᴜʀᴀᴛɪᴏɴ* :- ${result.duration}
│✘ *🍁 ᴜʀʟ* :- ${result.url} 
╰─────────────────╯`

          const categories = [];
            const categoryMap = new Map();

           for (let i = 0; i < 1; i++) {
                const cmd = commands[i];
                if (!cmd.dontAddCommandList && cmd.pattern !== undefined) {
                    const category = cmd.category.toUpperCase();
                    if (!categoryMap.has(category)) {
                        categories.push(category);
                        categoryMap.set(category, []);
                    }
                    categoryMap.get(category).push(cmd.pattern);
                }
            }
            const rows = []
           for (const category of categories) {


                rows.push({
                    header: "ᴠɪᴅᴇᴏ ᴛʏᴘᴇ",
                    title: "240P VIDEO",
                    description: "",
                    id: ".240p " + result.url
                
                }),
                rows.push({
                    header: "",
                    title: "360P VIDEO",
                    description: "",
                    id: ".360p " + result.url
                
                }),
                rows.push({
                    header: "",
                    title: "480P VIDEO",
                    description: "",
                    id: ".480p " + result.url
                
                }), 
                rows.push({
                    header: "",
                    title: "720P VIDEO",
                    description: "",
                    id: ".720p " + result.url
                
                }), 
                rows.push({
                    header: "",
                    title: "1080P VIDEO",
                    description: "",
                    id: ".1080p " + result.url
                
                })
	   }
		
	const rows2 = []
           for (const category of categories) {
                rows2.push({
                    header: "ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ",
                    title: "240P VIDEO",
                    description: "",
                    id: ".24p " + result.url
                
                }),
		rows2.push({
                    header: "",
                    title: "360P VIDEO",
                    description: "",
                    id: ".36p " + result.url
                
                }),
	        rows2.push({
                    header: "",
                    title: "480P VIDEO",
                    description: "",
                    id: ".48p " + result.url
                
                }),
		rows2.push({
                    header: "",
                    title: "720P VIDEO",
                    description: "",
                    id: ".72p " + result.url
                
                }),
                rows2.push({
                    header: "",
                    title: "1080P VIDEO",
                    description: "",
                    id: ".108p " + result.url
                
                })	

           }     
            
                        let buttons = [
                        
                                                         {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "ɢᴇᴛ ᴀᴜᴅɪᴏ 🎶",
                        id: `.song ${q}`
                    }),
                }, 
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: 'ᴠɪᴅᴇᴏ ᴛʏᴘᴇ',
                        sections: [{
                            title: 'ᴘʟᴇᴀꜱᴇ ꜱᴇʟᴇᴄᴛᴇ ᴀ Qᴜᴀʟɪᴛʏ',
                            highlight_label: 'KAVISHAN-MD',
                            rows: rows

                        }]
                    }),
                },
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: 'ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ',
                        sections: [{
                            title: 'ᴘʟᴇᴀꜱᴇ ꜱᴇʟᴇᴄᴛᴇ ᴀ Qᴜᴀʟɪᴛʏ',
                            highlight_label: 'KAVISHAN-MD',
                            rows: rows2

                        }]
                    }),
                }                       
            ]
            let message = {
                image: result.thumbnail,
                header: '',
                footer: config.FOOTER,
                body: msg

            }
            return await conn.sendButtonMessage(from, buttons, m, message)
        } catch (e) {
            reply('ɪᴀᴍ ꜱᴏʀʀʏ ꜱᴀʀ ᴇʀʀᴏ 😪')
            l(e)
        }
    });




cmd({
  pattern: "song",
  category: "other",
  react: "🔉",
  use: ".song2 <song name>",
  desc: "youtube audio downloader",
  filename: __filename
  },
async (conn, mek, m, {
  reply,
  from,
  q,
  prefix
}) => {
  try {
    if (!q) return await reply("ᴘʟᴇᴀꜱᴇ ɢɪᴠᴇ ᴍᴇ ᴀ ɴᴀᴍᴇ 🐰")
    const zxc = await yts(q)
    const info = zxc.videos[0]
    const url = info.url
    let dl = await fg.yta(url)
    const msg = `───────────────────
🍁 𝗬𝗧 𝗠𝗣3 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 
───────────────────

╭─────────────────╮
│✓ *♠️ ᴛɪᴛʟᴇ* :- ${info.title}
│✓ *👀 ᴠɪᴇᴡꜱ* :- ${info.views}
│✓ *⌛ ᴅᴜʀᴀᴛɪᴏɴ* :- ${info.duration}
│✓ *⚓ ᴜʀʟ* :- ${info.url} 
╰─────────────────╯`
let buttons = [
              
                
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "ᴀᴜᴅɪᴏ ᴛʏᴘᴇ 🎶",
                        id: ".ytaud " + dl.dl_url
                    }),
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ 📂",
                        id: ".ytdoc " + dl.dl_url
                    }),
                }
                ]
                let message = {
                    image: info.thumbnail,
                    header: '',
                    footer: config.FOOTER,
                    body: msg

                }
                return conn.sendButtonMessage(from, buttons, m, message)
await conn.sendMessage(from, { react: { text: '✔️', key: mek.key }})
} catch (e) {
reply('*Error !!*')
console.log(e)
}
})
    
cmd({
  pattern: "ytaud",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
        try {
await conn.sendMessage(from, { react: { text: '🍁', key: mek.key }})
if(!q) return await conn.sendMessage(from , { text: 'ɴᴇᴇᴅ ʟɪɴᴋ ..........' }, { quoted: mek } ) 
let dl = await fg.yta(q)
let sendapk = await conn.sendMessage(from , { audio : { url : dl.dl_url  } ,mimetype: 'audio/mpeg', fileName : dl.title + '.' + 'mp3'} , { quoted: mek })
await conn.sendMessage(from, { react: { text: '📚', key: sendapk.key }})
await conn.sendMessage(from, { react: { text: '✔️', key: mek.key }})
} catch (e) {
  reply('ɪᴀᴍ ꜱᴏʀʀʏ ꜱᴀʀ ᴇʀʀᴏ 😪')
l(e)
}
})
cmd({
  pattern: "ytdoc",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
        try {
await conn.sendMessage(from, { react: { text: '🔃', key: mek.key }})
if(!q) return await conn.sendMessage(from , { text: 'ɴᴇᴇᴅ ʟɪɴᴋ .......' }, { quoted: mek } ) 
let dl = await fg.yta(q)
let sendapk = await conn.sendMessage(from , { document : { url : dl.dl_url  } ,mimetype: 'audio/mpeg', fileName : dl.title + '.' + 'mp3'} , { quoted: mek })
await conn.sendMessage(from, { react: { text: '📁', key: sendapk.key }})
await conn.sendMessage(from, { react: { text: '✔', key: mek.key }})
} catch (e) {
  reply('ɪᴀᴍ ꜱᴏʀʀʏ ꜱᴀʀ ᴇʀʀᴏ 😪')
l(e)
}
})
cmd({
  pattern: "ytvoice",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
        try {
await conn.sendMessage(from, { react: { text: '🔃', key: mek.key }})
if(!q) return await conn.sendMessage(from , { text: 'ɴᴇᴇᴅ ʟɪɴᴋ .....' }, { quoted: mek } ) 
let dl = await fg.yta(q)
let sendapk = await conn.sendMessage(from , { audio : { url : dl.dl_url  } ,mimetype: 'audio/mpeg', ptt: true, fileName : dl.title + '.' + 'mp3'} , { quoted: mek })
await conn.sendMessage(from, { react: { text: '📁', key: sendapk.key }})
await conn.sendMessage(from, { react: { text: '✅', key: mek.key }})
} catch (e) {
  reply('ɪᴀᴍ ꜱᴏʀʀʏ ꜱᴀʀ ᴇʀʀᴏ 😪')
l(e)
}
})


                

cmd({
    pattern: "240p",
    react: "🪫",
    dontAddCommandList: true,
    filename: __filename
},


async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['240p'].download())
let senda = await conn.sendMessage(from, { video: {url: await yt.video['240p'].download() },caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})

//---------------------------------------------------------------------------
cmd({
  pattern: "360p",
  use: '.360p <video url>',
  react: "🪫",
  desc: "Download yt videos.",
  filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['360p'].download())
let senda = await conn.sendMessage(from, { video: {url: await yt.video['360p'].download() },caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})

//---------------------------------------------------------------------------

cmd({
  pattern: "480p",
  use: '.480p <video url>',
  react: "🔋",
  desc: "Download yt videos.",
  filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['480p'].download())
let senda = await conn.sendMessage(from, { video: {url: await yt.video['480p'].download() },caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})

//---------------------------------------------------------------------------

cmd({
    pattern: "720p",
    use: '.720p <video url>',
    react: "🔋",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['720p'].download())
let senda = await conn.sendMessage(from, { video: {url: await yt.video['720p'].download() },caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})

//---------------------------------------------------------------------------

cmd({
  pattern: "1080p",
  use: '.1080p <video url>',
  react: "🔋",
  desc: "Download yt videos.",
  filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['1080p'].download())
let senda = await conn.sendMessage(from, { video: {url: await yt.video['1080p'].download() },caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})


cmd({
    pattern: "24p",
    use: '.240p <video url>',
    react: "🪫",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['240p'].download())
let senda = await conn.sendMessage(from, { document: {url: await yt.video['240p'].download() },fileName: 'video.mp4', mimetype: 'video/mp4' ,caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})
	
cmd({
    pattern: "36p",
    use: '.240p <video url>',
    react: "🪫",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['360p'].download())
let senda = await conn.sendMessage(from, { document: {url: await yt.video['360p'].download() },fileName: 'video.mp4', mimetype: 'video/mp4' ,caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})




cmd({
    pattern: "48p",
    use: '.480p <video url>',
    react: "🔋",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['480p'].download())
let senda = await conn.sendMessage(from, { document: {url: await yt.video['480p'].download() },fileName: 'video.mp4', mimetype: 'video/mp4' ,caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})

				      

cmd({
    pattern: "72p",
    use: '.720p <video url>',
    react: "🔋",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['720p'].download())
let senda = await conn.sendMessage(from, { document: {url: await yt.video['720p'].download() },fileName: 'video.mp4', mimetype: 'video/mp4' ,caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})


cmd({
    pattern: "108p",
    use: '.1080p <video url>',
    react: "🔋",
    desc: "Download yt videos.",
    filename: __filename

},

async (conn, m, mek, { from, q, reply }) => {
try{
if (!ytreg(q)) return await  reply(urlneed)
const yt2 = await  dl.youtubedl(q)
let yt = yt2
let size = await getsize(await yt.video['1080p'].download())
let senda = await conn.sendMessage(from, { document: {url: await yt.video['1080p'].download() },fileName: 'video.mp4', mimetype: 'video/mp4' ,caption: 'ʙᴜɴɴʏ ᴍᴅ ᴠ1 ᴜꜱᴇʀ ʙᴏᴛ 🐰'}, { quoted: mek })  
await conn.sendMessage(from, { react: { text: '📽️', key: senda.key }})
} catch (e) {
reply(N_FOUND)
l(e)
}
})    
