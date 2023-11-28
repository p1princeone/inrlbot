const {
    inrl,
    googleIt,
    weather,
    ringtone,
    GenListMessage,
    getLang
} = require('../lib');
let lang = getLang()


inrl({
    pattern: 'google',
    desc: lang.SCRAP.GOOGLE_DESC,
    react : "🙃",
    type: "search"
}, async (message, match) => {
    try {
        if (!match) return message.send(lang.BASE.TEXT);
        let teks = await googleIt(match);
        return await message.client.sendMessage (message.from, {
            text: "\n" + teks
        }, {
            quoted: message
        })
    } catch (e) {
        message.send(lang.BASE.FAILD);
    }
});
inrl({
    pattern: 'ringtone',
    desc: lang.SCRAP.RING_DESC,
    react : "🙃",
    type: "search"
}, async (message, match) => {
    try {
        if (!match) return message.send(lang.BASE.TEXT);
        let result = await ringtone(match), res=[];
        await result.map(r=>res.push(r.title));
        return await message.client.sendMessage (message.jid, {
            text: GenListMessage(lang.SCRAP.RING_LIST, res)
            });
     } catch (e) {
        message.send(lang.BASE.FAILD);
    }
});   

inrl({
    pattern: 'weather',
    desc: lang.SCRAP.WEATHER_DESC,
    react : "🔥",
    type: "search"
}, async (message, match) => {
    if(!match) return await m.send(lang.SCRAP.NEED_PLACE)
    try {
        return await weather(message);
    } catch (e) {
        return message.send(lang.BASE.FAILD);
    }
});

inrl({
    on: "text"
}, async (m, match) => {
    if (!m.quoted || !m.quoted?.fromMe) return;
    if(!m.client.body.includes(lang.SCRAP.RING_LIST)) return;
    match = m.client.body.replace(lang.SCRAP.RING_LIST, "").trim();
    await m.send("*_downloading_*:-\n\n"+match);
    let result = await ringtone(match);
    return await m.conn.sendMessage(m.jid, {
    audio:{
                url: result[0].audio
            },
            fileName: result[0].title + '.mp3',
            mimetype: 'audio/mpeg'
        }, {
            quoted: m
     })
});
