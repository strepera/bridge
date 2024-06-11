import fs from 'fs';


export async function levelHandler(bot, player) {
    const lowerPlayer = player.toLowerCase();
    const filePath = `bot/playerData/${lowerPlayer}.json`;

    try {
        const stat = await fs.promises.stat(filePath);
        if (!stat.isFile()) {
            throw new Error('File does not exist');
        }

        const data = await fs.promises.readFile(filePath, 'utf8');

        const json = JSON.parse(data);
        json[lowerPlayer].coins += 15;
        json[lowerPlayer].messageCount += 1;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

    } catch (error) {
        const json = {};
        json[player.toLowerCase()] = { "coins": 15, "messageCount": 1, "username": player };

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    }
}