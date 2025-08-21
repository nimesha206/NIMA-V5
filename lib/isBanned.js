const fs = require('fs');

function isBanned(userId) {
    try {
        const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json', 'utf8'));
        return bannedUsers.includes(userId);
    } catch (error) {
        console.error('තහනම් තත්ත්වය පරීක්ෂා කිරීමේ දෝෂයකි:', error);
        return false;
    }
}

module.exports = { isBanned }; 