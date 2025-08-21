// const { ttdl } = require("ruhend-scraper");
const axios = require('axios');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

async function tiktokCommand(sock, chatId, message) {
    try {
        // Prevent duplicate processing
        if (processedMessages.has(message.key.id)) return;
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "කරුණාකර මට ලිංකුව ලබාදෙන්න."
            });
        }

        const url = text.split(' ').slice(1).join(' ').trim();
        if (!url) {
            return await sock.sendMessage(chatId, { 
                text: "කරුණාකර මට ලිංකුව ලබාදෙන්න."
            });
        }

        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//,
            /https?:\/\/(?:www\.)?tiktok\.com\/@/,
            /https?:\/\/(?:www\.)?tiktok\.com\/t\//
        ];

        const isValidUrl = tiktokPatterns.some(pattern => pattern.test(url));
        if (!isValidUrl) {
            return await sock.sendMessage(chatId, { 
                text: "වැරදි ලිංකුවකි. නිවැරදිදැයි පරීක්ෂා කර නැවත උත්සහ කරන්න."
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        try {
            // ✅ New API for TikTok download (with watermark)
            const apiResponse = await axios.get(`https://iamtkm.vercel.app/downloaders/tiktokdl?url=${encodeURIComponent(url)}`);
            const data = apiResponse.data;

            if (data && data.status && data.result && data.result.watermark) {
                const videoUrl = data.result.watermark;
                const caption = data.result.title || "CREATED BY NIMA";

                await sock.sendMessage(chatId, {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: caption
                }, { quoted: message });
            } else {
                return await sock.sendMessage(chatId, {
                    text: "දෝෂයකි. පසුව නැවත උත්සහ කරන්න."
                });
            }

        } catch (error) {
            console.error('Error in TikTok API:', error);
            await sock.sendMessage(chatId, {
                text: "Failed to download the TikTok video. Please try again later."
            });
        }
    } catch (error) {
        console.error('Error in TikTok command:', error);
        await sock.sendMessage(chatId, {
            text: "දෝෂයකි. පසුව නැවත උත්සහ කරන්න."
        });
    }
}

module.exports = tiktokCommand;
