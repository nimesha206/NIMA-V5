const settings = require('../settings');

async function ownerCommand(sock, chatId) {
    const vcard = `
BEGIN:VCARD
VERSION:5
FN:${settings.botOwner}
TEL;ටිකක් ඉන්න=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`;

    await sock.sendMessage(chatId, {
        contacts: { displayName: settings.botOwner, contacts: [{ vcard }] },
    });
}

module.exports = ownerCommand;
