import fs from 'fs';

const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
const json = JSON.parse(data);

for (const player in json) {
    const obj = {[player]: json[player]};
    fs.promises.writeFile('bot/playerData/' + player + '.json', JSON.stringify(obj), null, 2);
}