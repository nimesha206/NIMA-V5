const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '@neletter',
            newsletterName: 'NIMA-V5',
            serverMessageId: -1
        }
    }
};

// Path to store auto status configuration
const configPath = path.join(__dirname, '../data/autoStatus.json');

// Initialize config file if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false }));
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        // Check if sender is owner
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ හිමිකරුට පමණක් වෙන් උනු විධානයකි!',
                ...channelInfo
            });
            return;
        }

        // Read current config
        let config = JSON.parse(fs.readFileSync(configPath));

        // If no arguments, show current status
        if (!args || args.length === 0) {
            const status = config.enabled ? 'සක්‍රීයයි' : 'අක්‍රීයයි';
            await sock.sendMessage(chatId, { 
                text: `🔄 *ස්වයංක්‍රීය තත්ව දසුන*\n\nවත්මන් තත්ත්වය: ${status}\n\nභාවිතා කරන්න:\n.autostatus සක්‍රිය - ස්වයංක්‍රීය තත්ව දසුන සක්‍රිය කරන්න\n.autostatus අක්‍රිය කරන්න - ස්වයංක්‍රීය තත්ව දසුන අක්‍රිය කරන්න`,
                ...channelInfo
            });
            return;
        }

        // Handle on/off commands
        const command = args[0].toLowerCase();
        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '✅ ස්වයංක්‍රීය තත්ව දර්ශනය සහ කැමැත්ත සක්‍රීය කර ඇත!\nබොට් දැන් සියලුම සම්බන්ධතා තත්ව ස්වයංක්‍රීයව නරඹා කැමැත්ත දක්වනු ඇත.',
                ...channelInfo
            });
        } else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '❌ ස්වයංක්‍රීය තත්ව දසුන අක්‍රිය කර ඇත!\nබොට් තවදුරටත් ස්වයංක්‍රීයව තත්ව නොපෙන්වයි.',
                ...channelInfo
            });
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ අවලංගු විධානයක්! භාවිතා කරන්න:\n.autostatus සක්‍රීයයි - ස්වයංක්‍රීය තත්ව දර්ශනය සක්‍රීයයි\n.autostatus අක්‍රියයි - ස්වයංක්‍රීය තත්ව දර්ශනය අක්‍රීයයි',
                ...channelInfo
            });
        }

    } catch (error) {
        console.error('autostatus විධානයේ දෝෂයක්:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ ස්වයංක්‍රීය තත්ත්වය කළමනාකරණය කිරීමේදී දෝෂයක් ඇති විය.!\n' + error.message,
            ...channelInfo
        });
    }
}

// Function to check if auto status is enabled
function isAutoStatusEnabled() {
    try {
        const config = JSON.parse(fs.readFileSync(configPath));
        return config.enabled;
    } catch (error) {
        console.error('ස්වයංක්‍රීය තත්ව වින්‍යාසය පරීක්ෂා කිරීමේදී දෝෂයකි:', error);
        return false;
    }
}

// Function to handle status updates
async function handleStatusUpdate(sock, status) {
    try {
        if (!isAutoStatusEnabled()) {
            return;
        }

        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Handle status from messages.upsert
        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                try {
                    await sock.readMessages([msg.key]);
                    const sender = msg.key.participant || msg.key.remoteJid;
                   // console.log(`✅ Status Viewed `);
                } catch (err) {
                    if (err.message?.includes('rate-overlimit')) {
                        console.log('⚠️ අනුපාත සීමාවට ළඟා විය, නැවත උත්සාහ කිරීමට පෙර රැඳී සිටිමින්...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await sock.readMessages([msg.key]);
                    } else {
                        throw err;
                    }
                }
                return;
            }
        }

        // Handle direct status updates
        if (status.key && status.key.remoteJid === 'status@broadcast') {
            try {
                await sock.readMessages([status.key]);
                const sender = status.key.participant || status.key.remoteJid;
                console.log(`✅ සිට තත්ත්වය බැලුවා: ${sender.split('@')[0]}`);
            } catch (err) {
                if (err.message?.includes('rate-overlimit')) {
                    console.log('⚠️ අනුපාත සීමාවට ළඟා විය, නැවත උත්සාහ කිරීමට පෙර රැඳී සිටිමින්...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await sock.readMessages([status.key]);
                } else {
                    throw err;
                }
            }
            return;
        }

        // Handle status in reactions
        if (status.reaction && status.reaction.key.remoteJid === 'status@broadcast') {
            try {
                await sock.readMessages([status.reaction.key]);
                const sender = status.reaction.key.participant || status.reaction.key.remoteJid;
                console.log(`✅ සිට තත්ත්වය බැලුවා: ${sender.split('@')[0]}`);
            } catch (err) {
                if (err.message?.includes('rate-overlimit')) {
                    console.log('⚠️ අනුපාත සීමාවට ළඟා විය, නැවත උත්සාහ කිරීමට පෙර රැඳී සිටිමින්...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await sock.readMessages([status.reaction.key]);
                } else {
                    throw err;
                }
            }
            return;
        }

    } catch (error) {
        console.error('❌ ස්වයංක්‍රීය තත්ව දර්ශනයේ දෝෂයකි:', error.message);
    }
}

module.exports = {
    autoStatusCommand,
    handleStatusUpdate
}; 
