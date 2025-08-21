const isAdmin = require('../lib/isAdmin');

async function kickCommand(sock, chatId, senderId, mentionedJids, message) {
    // Check if user is owner
    const isOwner = message.key.fromMe;
    if (!isOwner) {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: 'කරුණාකර ප්‍රථමයෙන් ඇඩ්මින් තනතුර ලබා දෙන්න 😕.' }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: 'සමූහයේ ඇඩ්මින් වරුන්ට පමණයි ඉවත් කල හැක්කේ 😅✌️.' }, { quoted: message });
            return;
        }
    }

    let usersToKick = [];
    
    // Check for mentioned users
    if (mentionedJids && mentionedJids.length > 0) {
        usersToKick = mentionedJids;
    }
    // Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        usersToKick = [message.message.extendedTextMessage.contextInfo.participant];
    }
    
    // If no user found through either method
    if (usersToKick.length === 0) {
        await sock.sendMessage(chatId, { 
            text: 'ඉවත් කිරීමට අවශ්‍ය කෙනාව තෝරන්න!'
        }, { quoted: message });
        return;
    }

    // Get bot's ID
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // Check if any of the users to kick is the bot itself
    if (usersToKick.includes(botId)) {
        await sock.sendMessage(chatId, { 
            text: "මට ඔහුව ඉවත් කරන්න බෑ 😕! 🤖"
        }, { quoted: message });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, usersToKick, "remove");
        
        // Get usernames for each kicked user
        const usernames = await Promise.all(usersToKick.map(async jid => {
            return `@${jid.split('@')[0]}`;
        }));
        
        await sock.sendMessage(chatId, { 
            text: `${usernames.join(', ')} පයින් ගසා පන්නා දමන ලදි!`,
            mentions: usersToKick
        });
    } catch (error) {
        console.error('ඉවත් කිරීමේ දෝෂයකි:', error);
        await sock.sendMessage(chatId, { 
            text: 'ඉවත් කිරීම අසාර්ථකයි(s)!'
        });
    }
}

module.exports = kickCommand;
