const fetch = require('node-fetch');

async function handleTranslateCommand(sock, chatId, message, match) {
    try {
        // Show typing indicator
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);

        let textToTranslate = '';
        let lang = '';

        // Check if it's a reply
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMessage) {
            // Get text from quoted message
            textToTranslate = quotedMessage.conversation || 
                            quotedMessage.extendedTextMessage?.text || 
                            quotedMessage.imageMessage?.caption || 
                            quotedMessage.videoMessage?.caption || 
                            '';

            // Get language from command
            lang = match.trim();
        } else {
            // Parse command arguments for direct message
            const args = match.trim().split(' ');
            if (args.length < 2) {
                return sock.sendMessage(chatId, {
                    text: `*පරිවර්තක*\n\nභාවිතය:\n1. .translate <lang> හෝ .trt <lang>\n2. නැතහොත් ටයිප් කරන්න: .translate <text> <lang> හෝ .trt <text> <lang>\n\nඋදාහරණය:\n.translate hello fr\n.trt hello fr\n\nභාෂා කේත:\nfr - ප්‍රංශ\nes - ස්පාඤ්ඤ\nde - ජර්මන්\nit - ඉතාලි\npt - පෘතුගීසි\nru - රුසියානු\nja - ජපන්\nko - කොරියානු\nzh - චීන\nar - අරාබි\nhi - හින්දි`,
                    quoted: message
                });
            }

            lang = args.pop(); // Get language code
            textToTranslate = args.join(' '); // Get text to translate
        }

        if (!textToTranslate) {
            return sock.sendMessage(chatId, {
                text: '❌ පරිවර්තනය කිරීමට වචනයක් හමු නොවුනි. කරුණාකර වචනයක් හො පිංතූරයක් ලබා දෙන්න.',
                quoted: message
            });
        }

        // Try multiple translation APIs in sequence
        let translatedText = null;
        let error = null;

        // Try API 1 (Google Translate API)
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTranslate)}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    translatedText = data[0][0][0];
                }
            }
        } catch (e) {
            error = e;
        }

        // If API 1 fails, try API 2
        if (!translatedText) {
            try {
                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=auto|${lang}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.responseData && data.responseData.translatedText) {
                        translatedText = data.responseData.translatedText;
                    }
                }
            } catch (e) {
                error = e;
            }
        }

        // If API 2 fails, try API 3
        if (!translatedText) {
            try {
                const response = await fetch(`https://api.dreaded.site/api/translate?text=${encodeURIComponent(textToTranslate)}&lang=${lang}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.translated) {
                        translatedText = data.translated;
                    }
                }
            } catch (e) {
                error = e;
            }
        }

        if (!translatedText) {
            throw new Error('All translation APIs failed');
        }

        // Send translation
        await sock.sendMessage(chatId, {
            text: `${translatedText}`,
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('❌ විධානය වැරදියි:', error);
        await sock.sendMessage(chatId, {
            text: '❌ පෙළ පරිවර්තනය කිරීමට අපොහොසත් විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.\n\nභාවිතය:\n1. පණිවිඩයකට පිළිතුරු දෙන්න: .translate <lang> හෝ .trt <lang>\n2. නැතහොත් ටයිප් කරන්න: .translate <text> <lang> හෝ .trt <text> <lang> ටයිප් කරන්න.',
            quoted: message
        });
    }
}

module.exports = {
    handleTranslateCommand
}; 