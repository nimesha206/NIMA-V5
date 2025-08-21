const { handleAntiBadwordCommand } = require('../lib/antibadword');
const isAdminHelper = require('../lib/isAdmin');

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
    try {
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: '```ඇඩ්මින් වරුන්ට පමණි!```' });
            return;
        }

        // Extract match from message
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const match = text.split(' ').slice(1).join(' ');

        await handleAntiBadwordCommand(sock, chatId, message, match);
    } catch (error) {
        console.error('ප්‍රති වැරදි වැඩ විධානයේ දෝෂයක්:', error);
        await sock.sendMessage(chatId, { text: '*ප්‍රති වැරදි වැඩ විධානයේ දෝෂයක්*' });
    }
}

module.exports = antibadwordCommand; 