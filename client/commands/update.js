import {
    checkVerification
} from '../checkVerification.js';

import {
    MessageEmbed
} from 'discord.js';

const embed = new MessageEmbed()
    .setTitle('Updated Member!')
    .setDescription('Successfully updated roles and nickname')
    .setColor('#1ea863')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')

export async function func(interaction, options) {
    const member = options.getMember('username');
    checkVerification(member);
    interaction.reply({embeds: [embed]})
}

export const data = {
    name: "update",
    description: "updates specified user",
    options: [{
        name: "username",
        type: "USER",
        description: "Select a user to update",
        required: true
    }]
}