import fs from 'fs';

export default async function(bot, bet, player, chat) {
    const side = bet.split(' ')[1];
    if (!side) {
        bot.chat(chat + 'You need to pick a side! e.g. ".cf 100 tails');
        global.lastMessage = (chat + 'You need to pick a side! e.g. ".cf 100 tails');
        return;
    }
    bet = bet.split(' ')[0].replace(/[^0-9]/g, '');
    if (bet.trim() == '') {
      bot.chat(chat + 'You need to bet an amount! e.g. ".cf 100 tails"');
      global.lastMessage = (chat + 'You need to bet an amount! e.g. ".cf 100 tails"');
      return;
    }
    if (Number(bet) < 100) {
      bot.chat(chat + 'You need to bet at least 100 coins!');
      global.lastMessage = (chat + 'You need to bet at least 100 coins!');
      return;
    }
    let playerObj;
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    playerObj = json[player.toLowerCase()];
    if (Number(bet) > playerObj.coins) {
      bot.chat(chat + 'You cannot bet more coins than you have!');
      global.lastMessage = (chat + 'You cannot bet more coins than you have!');
      return;
    }
  
    const coin = Math.random() > 0.5 ? 'heads' : 'tails';

    if (side == 'heads' || side == 'tails') {
      if (coin == side) {
          var reward = bet / 2;
      }
      else {
          var reward = bet / 2 * -1;
      }
    }
    else {
      bot.chat(chat + 'Pick heads or tails!');
      global.lastMessage = (chat + 'Pick heads or tails!');
      return;
    }
  
    playerObj.coins += Math.floor(reward);
    json[player.toLowerCase()] = playerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
  
    if (reward > 0) reward = '+' + reward;
    bot.chat(chat + 'The coin flipped ' + coin + '. You chose ' + side + ' (' + reward + ')');
    global.lastMessage = (chat + 'The coin flipped ' + coin + '. You chose ' + side + ' (' + reward + ')');
}
