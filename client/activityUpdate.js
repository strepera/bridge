import fs from 'fs';

export default async function updateActivityFile() {
    fs.readFile('./client/activity.json', 'utf8', (err, data) => {
        if (err) throw err;

        let jsonData;
        jsonData = JSON.parse(data);

        const now = new Date().toISOString();

        jsonData[now] = { online: global.onlinePlayers, total: global.totalPlayers, messages: global.messageCount };
        global.messageCount = 0;

        fs.writeFile('./client/activity.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            console.log('Updated Activity JSON file successfully.');
        });
    });
}
