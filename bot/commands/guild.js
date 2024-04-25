export default async function getGuildData(bot, requestedPlayer, level) {
    requestedPlayer = requestedPlayer.replaceAll(' ', '%20');
    const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${requestedPlayer}`);
    const json = await response.json();
    if (json.guild == null) {
        const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
        const json0 = await response0.json();
        const uuid = json0.id;
        const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&player=${uuid}`);
        const json = await response.json();
        if (json.success != true) {
            bot.chat('/gc Invalid guild/player');
            bot.lastMessage = ('/gc Invalid guild/player');
            return;
        }
        if (json.guild == null) {
            bot.chat('/gc Player is not in a guild');
            bot.lastMessage = ('/gc Player is not in a guild');
            return;
        }
        const name = json.guild.name;
        const tag = json.guild.tag;
        const created = new Date(json.guild.created).toLocaleDateString({});
        const members = json.guild.members.length;
        let leader;
        for (const member of json.guild.members) {
            if (member.rank == 'Guild Master') {
                const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
                const json0 = await response0.json();
                leader = json0.name;
                break;
            }
        }
        const exp = json.guild.exp;
        if (exp > 20000000) {
            level = Math.round(((exp - 20000000) / 3000000 + 14) * 100) / 100;
        }
        else {
            level = Math.round(expToLevel.reduce((acc, val, idx) => {
                if (exp >= val && exp < expToLevel[idx + 1]) {
                    return idx + ((exp - val) / (expToLevel[idx + 1] - val));
                }
                return acc;
            }) * 100) / 100;
        }
        bot.chat(`/gc ${name} [${tag}] [${level}] created ${created} by ${leader} (${members}/125)`);
        bot.lastMessage = (`/gc ${name} [${tag}] [${level}] created ${created} by ${leader} (${members}/125)`);
        return;
    }
    else if (json.success == true) {
        const name = json.guild.name;
        const tag = json.guild.tag;
        const created = new Date(json.guild.created).toLocaleDateString({});
        const members = json.guild.members.length;
        let leader;
        for (const member of json.guild.members) {
            if (member.rank == 'Guild Master') {
                const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
                const json0 = await response0.json();
                leader = json0.name;
                break;
            }
        }
        const exp = json.guild.exp;
        if (exp > 20000000) {
            level = Math.round(((exp - 20000000) / 3000000 + 14) * 100) / 100;
        }
        else {
            level = Math.round(expToLevel.reduce((acc, val, idx) => {
                if (exp >= val && exp < expToLevel[idx + 1]) {
                    return idx + ((exp - val) / (expToLevel[idx + 1] - val));
                }
                return acc;
            }) * 100) / 100;
        }
        bot.chat(`/gc ${name} [${tag}] [${level}] created ${created} by ${leader} (${members}/125)`);
        bot.lastMessage = (`/gc ${name} [${tag}] [${level}] created ${created} by ${leader} (${members}/125)`);
        return;
    }
}

const expToLevel = [
    0,
    100000,
    250000,
    500000,
    1000000,
    1750000,
    2750000,
    4000000,
    5500000,
    7500000,
    10000000,
    12500000,
    15000000,
    17500000,
    20000000
]
