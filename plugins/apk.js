const {
        inrl,
        GenListMessage
} = require('../lib');
const axios = require('axios');
const {
        BASE_URL
} = require('../config');
inrl({
        pattern: 'apk',
        type: "downloader",
        desc: "download applications from aptoid",
}, async (message, match) => {
        let NewArray = [];
        try {
                match = match || message.reply_message.text;
                if (!match) return await message.send("*please give me an application name*");
                const {
                        data
                } = await axios(BASE_URL + 'api/apk/search?query=' + encodeURIComponent(match));
                if (!data.status || !data.result) return await message.send("*No result Found*");
                data.result.map(r => NewArray.push(r.name));
                return await message.send(GenListMessage("APK DOWNLOADER", NewArray));
        } catch (e) {
                return message.send('_Time Out_');
        }
});
inrl({
        on: "text"
}, async (message, match) => {
        if (!message.quoted?.fromMe) return;
        try {
                if (!message.client.body.includes("APK DOWNLOADER")) return;
                match = message.client.body.replace("APK DOWNLOADER", "").trim();
                const {
                        data
                } = await axios(BASE_URL + 'api/apk/download?query=' + encodeURIComponent(match));
                if (!data.status || !data.result) return await message.send("*No result Found*");
                await message.sendReply(data.result.icon, {
                        caption: "*downloading⬇️*\n```" + match + "```\n*developer*: ```" + data.result.dev + "```"
                }, "image");
                return await message.conn.sendMessage(message.chat, {
                        document: {
                                url: data.result.link
                        },
                        mimetype: `application/vnd.android.package-archive`,
                        fileName: data.result.name
                }, {
                        quoted: message
                })
        } catch (e) {
                return await message.send('_Error, try again!_')
        }
});
