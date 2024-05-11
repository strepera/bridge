import fs from 'fs';

export default async function stock(bot, request, player, chat) {

    function msg(message) {
        bot.chat(chat + message);
        bot.lastMessage = (chat + message);
    }

    const stocks = JSON.parse(await fs.promises.readFile('bot/stockPrices.json', 'utf8'));

    let stockNames = [];
    for (const stock in stocks) {
        stockNames.push(stocks[stock].name + ' ($' + stocks[stock].value + ')');
    }

    let stockType = request.split(' ')[1];
    let playerData;
    switch(request.split(' ')[0]) {
        case "list":
            msg("Available stocks: " + stockNames.join(', '));
            break;
        case "buy":
            const buyAmount = Number(request.split(' ')[2]);
            if (stockType) stockType = stockType.toLowerCase();
            if (!stocks[stockType]) return msg("Invalid stock " + stockType);
            if (!stockType || !buyAmount) return msg("Invalid syntax. Usage: .stock buy stock amount");

            playerData = JSON.parse(await fs.promises.readFile('bot/playerData.json', 'utf8'));
            if (playerData[player.toLowerCase()].coins <= stocks[stockType].value * buyAmount) return msg("You do not have enough coins to buy this!");
            stocks[stockType].ownership.none -= buyAmount;
            if (!stocks[stockType].ownership[player.toLowerCase()]) stocks[stockType].ownership[player.toLowerCase()] = buyAmount;
            else stocks[stockType].ownership[player.toLowerCase()] += buyAmount;
            playerData[player.toLowerCase()].coins -= stocks[stockType].value * buyAmount;
            msg("Bought [" + buyAmount + '] ' + stocks[stockType].name + ' stocks for $' + stocks[stockType].value * buyAmount);
            fs.writeFileSync('bot/playerData.json', JSON.stringify(playerData, null, 2));
            fs.writeFileSync('bot/stockPrices.json', JSON.stringify(stocks, null, 2));
            break;
        case "sell":
            const sellAmount = Number(request.split(' ')[2]);
            if (stockType) stockType = stockType.toLowerCase();
            if (!stocks[stockType]) return msg("Invalid stock " + stockType);
            if (!stockType || !sellAmount) return msg("Invalid syntax. Usage: .stock buy stock amount");

            playerData = JSON.parse(await fs.promises.readFile('bot/playerData.json', 'utf8'));
            if (!stocks[stockType].ownership[player.toLowerCase()]) return msg("You do not own any of this stock!");
            if (stocks[stockType].ownership[player.toLowerCase()] < sellAmount) return msg("You do not own enough of this stock!");
            stocks[stockType].ownership.none += sellAmount;
            stocks[stockType].ownership[player.toLowerCase()] -= sellAmount;
            if (stocks[stockType].ownership[player.toLowerCase()] == 0) delete stocks[stockType].ownership[player];
            playerData[player.toLowerCase()].coins += stocks[stockType].value * sellAmount;
            msg("Sold [" + sellAmount + '] ' + stocks[stockType].name + ' stocks and gained $' + stocks[stockType].value * sellAmount);
            fs.writeFileSync('bot/playerData.json', JSON.stringify(playerData, null, 2));
            fs.writeFileSync('bot/stockPrices.json', JSON.stringify(stocks, null, 2));
            break;
        case "price":
            let stock = request.split(' ')[1];
            if (!stocks[stock]) return msg("Invalid stock " + stock);
            stock = stock.toLowerCase();
            msg(stocks[stock].name + "'s price is at $" + stocks[stock].value);
            break;
        case "inventory":
            let ownedStocks = [];
            for (const stock in stocks) {
                if (stocks[stock].ownership[player.toLowerCase()]) {
                    ownedStocks.push(stocks[stock].name + ' ' + stocks[stock].ownership[player.toLowerCase()] + ' ($' + stocks[stock].value * stocks[stock].ownership[player.toLowerCase()] + ')');
                }
            }
            ownedStocks = ownedStocks.join(', ');
            if (ownedStocks == '') return msg("You do not own any stocks.")
            msg("Owned stocks: " + ownedStocks);
            break;
        default: 
            msg("Stock commands: .stock list, .stock buy {stock}, .stock sell {stock}, .stock price {stock}, .stock inventory");
            break;
    }

}