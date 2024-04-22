import fs from 'fs';

export default async function(bot, bet, player, chat) {
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    const json = JSON.parse(data);
    const playerObj = json[player.toLowerCase()];

    if (bet.trim() == '') {
        bot.chat(chat + 'You need to bet an amount! e.g. ".dice 100"');
        global.lastMessage = (chat + 'You need to bet an amount! e.g. ".dice 100"');
        return;
    }

    if (bet.split(' ')[0].toLowerCase() === 'all') {
        bet = playerObj.coins;
    } else {
        bet = bet.split(' ')[0].replace(/[^0-9]/g, '');
    }

    if (Number(bet) < 100) {
        bot.chat(chat + 'You need to bet at least 100 coins! You have ' + playerObj.coins + ' coins.');
        global.lastMessage = (chat + 'You need to bet at least 100 coins! You have ' + playerObj.coins + ' coins.');
        return;
    }

    if (Number(bet) > playerObj.coins) {
        bot.chat(chat + 'You cannot bet more coins than you have! Your current balance is ' + playerObj.coins + ' coins.');
        global.lastMessage = (chat + 'You cannot bet more coins than you have! Your current balance is ' + playerObj.coins + ' coins.');
        return;
    }

    const dice1 = Math.round(Math.random() * (6 - 1) + 1);
    const dice2 = Math.round(Math.random() * (6 - 1) + 1);
    let reward = Math.round((dice1 + dice2 - 8) * Number(bet) / 60);

    playerObj.coins += reward;
    json[player.toLowerCase()] = playerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));

    if (reward > 0) reward = '+' + reward;
    bot.chat(chat + 'The dice rolled ' + dice1 + ' + ' + dice2 + '. (' + reward + ')');
    global.lastMessage = (chat + 'The dice rolled ' + dice1 + ' + ' + dice2 + '. (' + reward + ')');
}