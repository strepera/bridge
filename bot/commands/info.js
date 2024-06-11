import fs from 'fs';

export default async function info(bot, player, placeholder, chat) {
    try {
        const stat = await fs.promises.stat(`bot/playerData/${player.toLowerCase()}.json`);
        if (!stat.isFile()) {
            throw new Error('File does not exist');
        }
        const data = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
        const json = JSON.parse(data);
    
        player = player.split(' ')[0];
    
        if (player == 'top') {
            const entries = Object.entries(json);
            const sortedEntries = entries.sort((a, b) => b[1].coins - a[1].coins);
            const top3Users = sortedEntries.slice(0, 3);
    
            let message = [];
            for (const i in top3Users) {
                message.push(`${Number(i) + 1}. ${top3Users[i][1].username} $${top3Users[i][1].coins}, ${top3Users[i][1].messageCount} msgs`);
            }
            return (chat + message.join(', '));
        }
    
        if (!json[player.toLowerCase()]) { 
            return (chat + 'Invalid player.');
        }
            
        return (`${chat}${json[player.toLowerCase()].username} has ${json[player.toLowerCase()].coins.toLocaleString()} coins and has sent ${json[player.toLowerCase()].messageCount.toLocaleString()} messages`);
    }
    catch (error) {
        return chat + 'Player has no data.';
    }
}