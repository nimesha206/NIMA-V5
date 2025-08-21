const axios = require('axios');

async function getppCommand(sock, chatId, message) {
    try {
        // Check if user is owner
        const isOwner = message.key.fromMe; // Fixed variable name from 'msg' to 'message'
        if (!isOwner) {
            await sock.sendMessage(chatId, { 
                text: 'අයිතිකරුට පමණක් වලංගු ඌ විධානයකි.' 
            });
            return;
        }

        let userToAnalyze;
        
        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToAnalyze) {
            await sock.sendMessage(chatId, { 
                text: 'කරුණාකර කෙනෙකුගේ පැතිකඩ පින්තූරය ලබා ගැනීමට ඔහුව සඳහන් කරන්න හෝ ඔවුන්ගේ පණිවිඩයට පිළිතුරු දෙන්න.🫴'
                });
            return;
        }

        try {
            // Get user's profile picture
            let profilePic;
            try {
                profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
            } catch {
                profilePic = 'https://files.catbox.moe/w9lv7j.jpg'; // Default image
            }

            // Send the profile picture to the chat
            await sock.sendMessage(chatId, {
                image: { url: profilePic },
                caption: `\n\n _🔸 හායි 👋 @${userToAnalyze.split('@')[0]} ගේ පැතිකඩ පිංතූරය ගැනීම සාර්ථකයි✅._`,
                mentions: [userToAnalyze]
            });

        } catch (error) {
            console.error('⚠️දෝෂකි, නැවත උත්සහ කරන්න:', error);
            await sock.sendMessage(chatId, {
                text: 'දෝෂයකි. නැවත උත්සහ කරන්න.'
            });
        }
    } catch (error) {
        console.error('⚠️දෝෂයකි. නැවත උත්සහ කරන්න:', error);
    }
}

module.exports = getppCommand; // Moved outside the function
