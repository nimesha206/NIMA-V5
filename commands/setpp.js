const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function setProfilePicture(sock, chatId, msg) {
    try {
        // Check if user is owner
        const isOwner = msg.key.fromMe;
        if (!isOwner) {
            await sock.sendMessage(chatId, { 
                text: '❌ අයිතිකරුට පමණක් සීමා වූ විධානයකි!' 
            });
            return;
        }

        // Check if message is a reply
        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage) {
            await sock.sendMessage(chatId, { 
                text: '_අවශ්‍ය පිංතූරයට setpp යනුවෙන් එවන්න!_' 
            });
            return;
        }

        // Check if quoted message contains an image
        const imageMessage = quotedMessage.imageMessage || quotedMessage.stickerMessage;
        if (!imageMessage) {
            await sock.sendMessage(chatId, { 
                text: '❌ දෝෂයකි!' 
            });
            return;
        }

        // Create tmp directory if it doesn't exist
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Download the image
        const stream = await downloadContentFromMessage(imageMessage, 'image');
        let buffer = Buffer.from([]);
        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const imagePath = path.join(tmpDir, `profile_${Date.now()}.jpg`);
        
        // Save the image
        fs.writeFileSync(imagePath, buffer);

        // Set the profile picture
        await sock.updateProfilePicture(sock.user.id, { url: imagePath });

        // Clean up the temporary file
        fs.unlinkSync(imagePath);

        await sock.sendMessage(chatId, { 
            text: 'පිංතූරය profile හි දැමීම සාර්ථකයි✔' 
        });

    } catch (error) {
        console.error('Error in setpp command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ පිංතූරය profile හි දැමීම අසාර්ථකයි!' 
        });
    }
}

module.exports = setProfilePicture; 
