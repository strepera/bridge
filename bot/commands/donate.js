import fs from 'fs';

export default async function(bot, requestedPlayer, player) {
    const payment = Number(requestedPlayer.split(' ')[1]);
    if (!payment) {
        bot.chat('You need to pick an amount to donate! e.g. ".donate snailify 100"');
        global.lastMessage = ('You need to pick an amount to donate! e.g. ".donate snailify 100"');
        return;
    }
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (requestedPlayer.trim() == '') {
      bot.chat('You need to pick a player to donate to! e.g. ".donate snailify 100"');
      global.lastMessage = ('You need to pick a player to donate to! e.g. ".donate snailify 100"');
      return;
    }
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    const playerObj = json[player.toLowerCase()];
    if (json[requestedPlayer.toLowerCase()]) {
        var requestedPlayerObj = json[requestedPlayer.toLowerCase()];
    }
    else {
        bot.chat('Invalid player.');
        global.lastMessage = ('Invalid player.');
        return;
    }
    if (payment > playerObj.coins) {
      bot.chat('You cannot donate more coins than you have!');
      global.lastMessage = ('You cannot donate more coins than you have!');
      return;
    }
  
    playerObj.coins -= payment;
    requestedPlayerObj.coins += payment;
    json[player.toLowerCase()] = playerObj;
    json[requestedPlayer.toLowerCase()] = requestedPlayerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
  
    bot.chat('/gc You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
    global.lastMessage = ('/gc You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
}
