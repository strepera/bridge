export async function func(interaction, options, bot) {
    if (interaction.user.id != process.env.ownerId) return;
    const message = options.getString('message');
    bot.chat(message);
    global.lastMessage = (message);
    interaction.reply(message + ' sent!');
}

export const data = {
    name: "say",
    description: "for owner",
    options: [{
        name: "message",
        type: "STRING",
        description: "message",
        required: true
    }]
}