import fs from 'fs';

export async function levelHandler(bot, player) {
    fs.readFile('bot/playerData.json', 'utf8', function (err, data) {
        if (err) throw err;
        
        let json = JSON.parse(data);

        const lowerPlayer = player.toLowerCase();
        if (json[lowerPlayer]) {
            json[lowerPlayer].coins += 15;
            json[lowerPlayer].messageCount += 1;
        } else json[player.toLowerCase()] = { "coins": 15, "messageCount": 1, "username": player }

        fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
    });
}