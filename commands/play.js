const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "මොකක්ද ඔයා කැමති සින්දුව?"
            });
        }

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "සමාවන්න. එම ගීතය හමු නොවුනි!"
            });
        }

        // Send loading message
        await sock.sendMessage(chatId, {
            text: "_රැඳීසිටින්න. බාගනිමින් පවතී.   👩‍💻❤️  *(NIMA CODER)*_"
        });

        // Get the first video result
        const video = videos[0];
        const urlYt = video.url;

        // Fetch audio data from API
        const response = await axios.get(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${urlYt}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.downloadUrl) {
            return await sock.sendMessage(chatId, { 
                text: "api කේතයෙහි යම් වැරදීමක් පෙනේ. පසුව උත්සහ කරන්න. සමාවෙන්න."
            });
        }

        const audioUrl = data.result.downloadUrl;
        const title = data.result.title;

        // Send the audio
        await sock.sendMessage(chatId, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in song2 command:', error);
        await sock.sendMessage(chatId, { 
            text: "*බාගැනීම අසාර්ථකයි. පසුව උත්සහ කරන්න 😥.*"
        });
    }
}

module.exports = playCommand; 

/*Powered by KNIGHT-BOT*
*Credits to Keith MD*`*/
