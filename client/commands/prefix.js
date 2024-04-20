import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";

import { prices } from '../prices.js';

export async function prefixCommand(interaction) {
    interaction.reply({embeds: [prefixEmbed], components: [row]});
}

export const prefixCommandData = {
    name: "prefix",
    description: "Your discord to minecraft chat separator!"
}

let options = [];

for (const symbol in prices) {
    options.push({
        label: symbol,
        description: `${prices[symbol].toLocaleString()} SnakeCoins`,
        value: symbol
    })
}

const dropdown = new MessageSelectMenu()
    .setCustomId('prefixSelection')
    .setPlaceholder('Choose a prefix')
    .addOptions(options)

const row = new MessageActionRow()
    .addComponents(dropdown)

const prefixEmbed = new MessageEmbed()
    .setColor('#1ea863')
    .setTitle('Prefixes')
    .setDescription('You can select your prefix for discord to minecraft chat messages with this command.\nSelect a prefix from the dropdown below to view its info!')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')