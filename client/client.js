import {
    prefixSelect,
    prefixBuy,
    prefixEquip,
    displayMainPrefix
} from './commands/prefix.js'
import {
    colorSelect,
    colorBuy,
    colorEquip,
    displayMainColor
} from './commands/color.js'
import {
    checkVerification
} from './checkVerification.js';
import getGist from './getGist.js'
import discordToMinecraft from './discordToMinecraft.js'
import fs from 'fs';
import {
    MessageEmbed
} from 'discord.js';

function ranRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function importCommand(commandName) {
    const commandModule = await
    import (`./commands/${commandName}.js`);
    return commandModule;
}

const commands = {
    'verify': '',
    'unverify': '',
    'prefix': '',
    'online': '',
    'say': '',
    'color': '',
    'update': ''
}

function updateActivityFile() {
    fs.readFile('./client/activity.json', 'utf8', (err, data) => {
        if (err) throw err;

        let jsonData;
        jsonData = JSON.parse(data);

        const now = new Date().toISOString();

        jsonData[now] = { online: global.onlinePlayers, total: global.totalPlayers, messages: global.messageCount };
        global.messageCount = 0;

        fs.writeFile('./client/activity.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) throw err;
            console.log('Updated Activity JSON file successfully.');
        });
    });
}

export async function discord(bot, client, branch, welcomeChannel, bridgeChannelId, stockChannel,) {

    getGist();

    client.on('ready', async() => {
        console.log('Logged in as ' + client.user.tag);
        const guild = await client.guilds.fetch(process.env.guildId);
        for (let command in commands) {
            const commandData = await importCommand(command);
            await guild.commands.create(commandData.data);
            commands[command] = commandData.func;
        }
        console.log('Imported: ');
        console.log(commands);
        const response = await fetch(`https://discord.com/api/webhooks/${process.env.bridgeId}/${process.env.bridgeToken}`);
        const json = await response.json();
        welcomeChannel = await client.channels.cache.get(process.env.welcomeChannelId);
        stockChannel = await client.channels.cache.get(process.env.stockId);
        bridgeChannelId = json.channel_id;
        setInterval(() => {
            client.user.setActivity(`${global.onlinePlayers} players!`, {
                type: "WATCHING"
            })
        }, 60 * 1000);
        setInterval(() => {
            guild.members.fetch()
                .then(members => {
                    members.forEach(member => checkVerification(member, bot, branch))
                })
        }, 2 * 60 * 60 * 1000);
        setInterval(() => {
            updateActivityFile();
        }, 5 * 60 * 1000);

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
    });

    client.on('messageCreate', (message) => discordToMinecraft(bot, client, message, bridgeChannelId));
    client.on('messageCreate', (message) => discordToMinecraft(branch, client, message, bridgeChannelId));

    client.on('interactionCreate', async interaction => {
        switch (interaction.customId) {
            case "displayMainPrefix":
                displayMainPrefix(interaction);
                break;
            case "prefixSelection":
                prefixSelect(interaction, interaction.values[0]);
                break;
            case "prefixBuy":
                prefixBuy(interaction);
                break;
            case "prefixEquip":
                prefixEquip(interaction);
                break;
            case "displayMainColor":
                displayMainColor(interaction);
                break;
            case "colorSelection":
                colorSelect(interaction, interaction.values[0]);
                break;
            case "colorBuy":
                colorBuy(interaction);
                break;
            case "colorEquip":
                colorEquip(interaction);
            default:
                break;
        }

        if (!interaction.isCommand()) return;
        const {
            commandName,
            options
        } = interaction;
        commands[commandName](interaction, options, bot, branch);
    })
    client.on('guildMemberAdd', async(member) => {
        await welcomeChannel.send('Welcome <@' + member.user.id + '>!');
        checkVerification(member, bot, branch);
    });

    client.on('guildMemberRemove', async(member) => {
        await welcomeChannel.send('Goodbye ' + member.user.username);
    });
}