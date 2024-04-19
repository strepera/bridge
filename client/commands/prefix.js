import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";

export async function prefixCommand(interaction) {
    interaction.reply({embeds: [prefixEmbed], components: [row]});
}

export const prefixCommandData = {
    name: "prefix",
    description: "Your discord to minecraft chat separator!"
}

const dropdown = new MessageSelectMenu()
    .setCustomId('prefixSelection')
    .setPlaceholder('Choose a prefix')
    .addOptions([
        {
            label: '~',
            description: '10,000 SnakeCoins',
            value: '~'
        },
        {
            label: '♀',
            description: '25,000 SnakeCoins',
            value: '♀'
        },
        {
            label: '♂',
            description: '25,000 SnakeCoins',
            value: '♂'
        },
        {
            label: '™',
            description: '50,000 SnakeCoins',
            value: '™'
        },
        {
            label: '✎',
            description: '65,000 SnakeCoins',
            value: '✎'
        },
        {
            label: 'ツ',
            description: '100,000 SnakeCoins',
            value: 'ツ'
        },
        {
            label: '✿',
            description: '125,000 SnakeCoins',
            value: '✿'
        },
        {
            label: '☠',
            description: '250,000 SnakeCoins',
            value: '☠'
        }
    ])

const row = new MessageActionRow()
    .addComponents(dropdown)

const prefixEmbed = new MessageEmbed()
    .setColor('#1ea863')
    .setTitle('Prefixes')
    .setDescription('You can select your prefix for discord to minecraft chat messages with this command.\nSelect a prefix from the dropdown below to view its info!')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')