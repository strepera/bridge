import fs from 'fs';

export default async function(bot, bet, player) {
    const side = bet.split('/')[1];
    if (!side) {
        bot.chat('You need to pick a side! e.g. ".cf 100/tails');
        global.lastMessage = ('You need to pick a side! e.g. ".cf 100/tails');
        return;
    }
    bet = bet.split(' ')[0].replace(/[^0-9]/g, '');
    if (bet.trim() == '') {
      bot.chat('You need to bet an amount! e.g. ".cf 100/tails"');
      global.lastMessage = ('You need to bet an amount! e.g. ".cf 100/tails"');
      return;
    }
    if (Number(bet) < 100) {
      bot.chat('You need to bet at least 100 coins!');
      global.lastMessage = ('You need to bet at least 100 coins!');
      return;
    }
    let playerObj;
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    playerObj = json[player.toLowerCase()];
    if (Number(bet) > playerObj.coins) {
      bot.chat('You cannot bet more coins than you have!');
      global.lastMessage = ('You cannot bet more coins than you have!');
      return;
    }
  
    const coin = Math.random() > 0.5 ? 'heads' : 'tails';

    if (coin == side) {
        var reward = bet / 2;
    }
    else {
        var reward = bet / 2 * -1;
    }
  
    playerObj.coins += reward;
    json[player.toLowerCase()] = playerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
  
    if (reward > 0) reward = '+' + reward;
    bot.chat('/gc The coin flipped ' + coin + '. You chose ' + side + ' (' + reward + ')');
    global.lastMessage = ('/gc The coin flipped ' + coin + '. You chose ' + side + ' (' + reward + ')');
}
