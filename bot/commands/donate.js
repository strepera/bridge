import fs from 'fs';

export default async function(bot, requestedPlayer, player, chat) {
    const payment = Number(requestedPlayer.split(' ')[1]);
    if (!payment) {
        return (chat + 'You need to pick an amount to donate! e.g. ".donate snailify 100"');
    }
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (requestedPlayer.trim() == '') {
      return (chat + 'You need to pick a player to donate to! e.g. ".donate snailify 100"');
    }
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    const playerObj = json[player.toLowerCase()];
    if (json[requestedPlayer.toLowerCase()]) {
        var requestedPlayerObj = json[requestedPlayer.toLowerCase()];
    }
    else {
        return (chat + 'Invalid player.');
    }
    if (payment > playerObj.coins) {
      return (chat + 'You cannot donate more coins than you have!');
    }
  
    playerObj.coins -= Math.floor(payment);
    requestedPlayerObj.coins += Math.floor(payment);
    json[player.toLowerCase()] = playerObj;
    json[requestedPlayer.toLowerCase()] = requestedPlayerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
  
    return (chat + 'You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
}
