import fs from 'fs';

function ranRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default async function stock(bot, request, player, chat) {

    function msg(message) {
        bot.chat(chat + message);
        global.lastMessage = (chat + message);
    }

    const stocks = JSON.parse(await fs.promises.readFile('bot/stockPrices.json', 'utf8'));

    let stockNames = [];
    for (const stock in stocks) {
        stockNames.push(stocks[stock].name);
    }

    switch(request.split(' ')[0]) {
        case "list":
            msg("Available stocks: " + stockNames.join(', '));
            break;
        case "buy":
            msg("");
            break;
        case "sell":
            msg("");
            break;
        case "price":
            let stock = request.split(' ')[1];
            if (!stocks[stock]) return msg("Invalid stock " + stock);
            stock = stock.toLowerCase();
            msg(stocks[stock].name + "'s price is at $" + stocks[stock].value);
            break;
        default: 
            msg("Stock commands: .stock list, .stock buy {stock}, .stock sell {stock}, .stock price {stock}");
            break;
    }

}