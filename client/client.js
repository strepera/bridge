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

export async function discord(bot, client, welcomeChannel, bridgeChannelId) {

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
        welcomeChannel = client.channels.cache.get(process.env.welcomeChannelId);
        bridgeChannelId = json.channel_id;
        setInterval(() => {
            client.user.setActivity(`${global.onlinePlayers} players!`, {
                type: "WATCHING"
            })
        }, 60 * 1000);
        setInterval(() => {
            guild.members.fetch()
                .then(members => {
                    members.forEach(member => checkVerification(member))
                })
        }, 3 * 60 * 60 * 1000);
    });

    client.on('messageCreate', (message) => discordToMinecraft(bot, client, message, bridgeChannelId));

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
        commands[commandName](interaction, options, bot);
    })
    client.on('guildMemberAdd', async(member) => {
        await welcomeChannel.send('Welcome <@' + member.user.id + '>!');
        checkVerification(member);
    });

    client.on('guildMemberRemove', async(member) => {
        await welcomeChannel.send('Goodbye ' + member.user.username);
    });
}