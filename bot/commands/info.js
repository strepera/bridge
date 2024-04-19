import fs from 'fs';

export default async function info(bot, player) {
    fs.readFile('bot/playerData.json', 'utf8', function (err, data) {
        if (err) throw err;

        let json = JSON.parse(data);

        bot.chat(`${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
        global.lastMessage = (`${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
    });
}