import fs from 'fs';
import { MessageEmbed } from 'discord.js';

function ranRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default async function(stockChannel) {
    async function updateStockPrices() {
        var now = new Date();
        var nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
        var difference = nextHour - now;

        setTimeout(async () => {
            const stocks = JSON.parse(await fs.promises.readFile('bot/stockPrices.json', 'utf8'));
            for (const stock in stocks) {
                const difference = stocks[stock].value / 100 * ranRange(-5, 5.5);
                stocks[stock].value = Math.floor(stocks[stock].value + difference);
            }
            fs.writeFileSync('bot/stockPrices.json', JSON.stringify(stocks, null, 2));
            let stockValues = [];
            for (const stock in stocks) {
                stockValues.push(stocks[stock].name + ': ' + stocks[stock].value)
            }
            stockChannel.send({
                embeds: [new MessageEmbed()
                    .setTitle('Stock Prices Updated')
                    .setDescription(stockValues.join('\n'))
                ]
            });
            updateStockPrices();
        }, difference);
    }
    updateStockPrices();
}