export async function func(interaction, options, bot, branch) {
    if (interaction.user.id != process.env.ownerId) return interaction.reply({content: 'You do not have permission to use this command.'});
    const message = options.getString('message');
    const guild = options.getString('guild');
    if (guild.toLowerCase() == 'nope ropes') {
        bot.chat(message);
        bot.lastMessage = (message);
        interaction.reply(message + ' sent!');
    }
    else {
        branch.chat(message);
        bot.lastMessage = (message);
        interaction.reply(message + ' sent!');
    }
}

export const data = {
    name: "say",
    description: "for owner",
    options: [{
        name: "message",
        type: "STRING",
        description: "message",
        required: true
    }, {
        name: "guild",
        type: "STRING",
        description: "Choose a guild",
        required: true,
        choices: [
            { name: "Nope Ropes", value: "nope ropes" },
            { name: "Danger Noodles", value: "danger noodles" }
        ]
    }]
}