export async function func(interaction, options, bot, branch) {
    const guild = options.getString('guild');
    if (guild.toLowerCase() == 'nope ropes') {
      bot.chat('/g online');
    }
    else {
      branch.chat('/g online');
    }

    function checkOnlineEmbed(interaction) {
        if (global.onlineEmbed != undefined) {
          interaction.reply({embeds: [global.onlineEmbed.embed]});
          delete global.onlineEmbed;
        }
        else {
          setTimeout(() => {
            checkOnlineEmbed(interaction);
          }, 500);
        }
    }
    checkOnlineEmbed(interaction);
}

export const data = {
    name: "online",
    description: "Shows you who's online ingame!",
    options: [{
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
