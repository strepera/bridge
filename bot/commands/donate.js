import fs from 'fs';

export default async function(bot, requestedPlayer, player, chat) {
    const payment = Number(requestedPlayer.split(' ')[1]);
    if (!payment) {
        bot.chat(chat + 'You need to pick an amount to donate! e.g. ".donate snailify 100"');
        global.lastMessage = (chat + 'You need to pick an amount to donate! e.g. ".donate snailify 100"');
        return;
    }
    requestedPlayer = requestedPlayer.split(' ')[0];
    if (requestedPlayer.trim() == '') {
      bot.chat(chat + 'You need to pick a player to donate to! e.g. ".donate snailify 100"');
      global.lastMessage = (chat + 'You need to pick a player to donate to! e.g. ".donate snailify 100"');
      return;
    }
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    const playerObj = json[player.toLowerCase()];
    if (json[requestedPlayer.toLowerCase()]) {
        var requestedPlayerObj = json[requestedPlayer.toLowerCase()];
    }
    else {
        bot.chat(chat + 'Invalid player.');
        global.lastMessage = (chat + 'Invalid player.');
        return;
    }
    if (payment > playerObj.coins) {
      bot.chat(chat + 'You cannot donate more coins than you have!');
      global.lastMessage = (chat + 'You cannot donate more coins than you have!');
      return;
    }
  
    playerObj.coins -= Math.floor(payment);
    requestedPlayerObj.coins += Math.floor(payment);
    json[player.toLowerCase()] = playerObj;
    json[requestedPlayer.toLowerCase()] = requestedPlayerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
  
    bot.chat(chat + 'You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
    global.lastMessage = (chat + 'You donated $' + payment + ' to ' + requestedPlayerObj.username + '.');
}
