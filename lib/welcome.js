const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');
const { delay } = require('@whiskeysockets/baileys');

async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📥 *පිළිගැනීමේ පණිවිඩ සැකසුම*\n\nපහත විධාන භාවිතා කරන්න:\n\n✅ *.welcome on* — පිළිගැනීමේ පණිවිඩ සක්‍රීය කරන්න\n🛠️ *.welcome set ඔබේ අභිරුචි පණිවිඩය* — අභිරුචි පිළිගැනීමේ පණිවිඩයක් සකසන්න\n🚫 *.welcome off* — පිළිගැනීමේ පණිවිඩ අක්‍රීය කරන්න\n\n*ලබා ගත හැකි විචල්‍යයන්:*\n• {user} - නව සාමාජිකයා සඳහන් කරයි\n• {group} - කණ්ඩායම් නම පෙන්වයි\n• {description} - කණ්ඩායම් විස්තරය පෙන්වයි`,
            quoted: message
        });
    }

    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ පිළිගැනීමේ පණිවිඩය දැනටමත් සක්‍රීයයි*.', quoted: message });
        }
        await addWelcome(chatId, true, null);
        return sock.sendMessage(chatId, { text: '✅ පිළිගැනීමේ පණිවිඩය සක්‍රියයි. භාවිත කරන්න *.welcome set [ඔබගේ පණිවිඩය]* customize කරන්න.', quoted: message });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ පිළිගැනීමේ පණිවිඩය දැනටමත් අක්‍රියයි*.', quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: '✅ දැන් මෙම සමූහයේ පිළිගැනීමේ පණිවිඩය අක්‍රීයයි.', quoted: message });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: '⚠️ කරුණාකර custom පිළිගැනීමේ පණිවිඩයක් සපයන්න. උදාහරණ: *.welcome set හායි. ඔබව සාදරයෙන් පිලිගන්නවා!*', quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: '✅ custom පිළිගැනීමේ පණිවිඩය * සාර්ථකව සකසා ඇත.*.', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `❌ අවලංගු විධානයක්. භාවිතා කරන්න:\n*.welcome on* - සක්‍රියයි\n*.welcome set [පණිවිඩය]* - custom පණිවිඩය සකසන්න\n*.welcome off* - අක්‍රියයි`,
        quoted: message
    });
}

async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `📤 *සමුගැනීමේ පණිවිඩ සැකසුම*\n\nපහත විධාන භාවිතා කරන්න:\n\n✅ *.goodbye on* — සමුගැනීමේ පණිවිඩ සක්‍රීය කරන්න\n🛠️ *.goodbye ඔබේ custom පණිවිඩය* — custom සමුගැනීමේ පණිවිඩයක් සකසන්න\n🚫 *.goodbye off* — සමුගැනීමේ පණිවිඩ අක්‍රීය කරන්න\n\n*ලබා ගත හැකි විචල්‍යයන්:*\n• {user} - ඉවත් වන සාමාජිකයා සඳහන් කරයි\n• {group} - කණ්ඩායම් නම පෙන්වයි`,
            quoted: message
        });
    }

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, { text: '⚠️ සමුගැනීමේ පණිවිඩය දැනටමත් අක්‍රියයි*.', quoted: message });
        }
        await addGoodbye(chatId, true, null);
        return sock.sendMessage(chatId, { text: '✅ සමුගැනීමේ පණිවිඩය සක්‍රීයයි. භාවිතා කරන්න *.goodbye [ඔබේ පණිවිඩය]* customize කරගන්න.', quoted: message });
    }

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, { text: '⚠️ සමුගැනීමේ පණිවිඩය දැනටමත් අක්‍රීයයි*.', quoted: message });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, { text: '✅ දැන් මෙම සමූහයේ සමුගැනීමේ පණිවිඩය අක්‍රීයයි.', quoted: message });
    }

    await delay(2000);
    await addGoodbye(chatId, true, match);
    return sock.sendMessage(chatId, { text: '✅ Custom සමුගැනීමේ පණිවිඩය සැකසීම සාර්ථකයි.', quoted: message });
}

module.exports = { handleWelcome, handleGoodbye };
// This code handles welcome and goodbye messages in a WhatsApp group using the Baileys library.