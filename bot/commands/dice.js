import fs from 'fs';

export default async function(bot, bet, player) {
  bet = bet.split(' ')[0];
  if (!bet) {
    bot.chat('You need to bet an amount!');
    global.lastMessage = ('You need to bet an amount!');
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
  }

  const dice1 = Math.round(Math.random() * (6-1) + 1);
  const dice2 = Math.round(Math.random() * (6-1) + 1);
  let reward = Math.round((dice1 + dice2 - 6) * Number(bet) / 80);

  playerObj.coins += reward;
  json[player.toLowerCase()] = playerObj;
  fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));

  if (reward > 0) reward = '+' + reward;
  bot.chat('/gc The dice rolled ' + dice1 + ' + ' + dice2 + '. (' + reward + ')');
  global.lastMessage = ('/gc The dice rolled ' + dice1 + ' + ' + dice2 + '. (' + reward + ')');
}
