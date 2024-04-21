export async function func(interaction, message, bot) {
    bot.chat('/g online');
    function checkOnlineEmbed(interaction) {
        if (global.onlineEmbed != undefined) {
          interaction.reply({embeds: [global.onlineEmbed]});
          delete global.onlineEmbed;
        }
        else {
          setTimeout(() => {
            checkOnlineEmbed(interaction);
          }, 500);
        }
    }
    checkOnlineEmbed(interaction, message, bot);
}

export const data = {
    name: "online",
    description: "Shows you who's online ingame!"
}
