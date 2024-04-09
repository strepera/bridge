const { MessageEmbed } = require('discord.js');

const regexes = [
  {
     regex: /Guild > (.+) joined./,
     func: (match, bridgeWebhook) => {
       return bridgeWebhook.send({
        embeds: [
          new MessageEmbed()
          .setColor('#00ff00')
          .setTitle(match[1] + ' joined!')
          .setDescription('Welcome!')
          .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
        ],
        username: match[1],
        avatarURL: `https://minotar.net/helm/${match[1]}/32`
       })
     }
  },
  {
     regex: /Guild > (.+) left./,
     func: (match, bridgeWebhook) => {
      return bridgeWebhook.send({
        embeds: [
          new MessageEmbed()
          .setColor('#ff0000')
          .setTitle(match[1] + ' left.')
          .setDescription('Goodbye.')
          .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
        ],
        username: match[1],
        avatarURL: `https://minotar.net/helm/${match[1]}/32`
       })
     }
  },
  {
     regex: /Guild > (?:\[(.+)\] )?(.+) \[(.+)\]: (.+)/,
     func: (match, bridgeWebhook) => {
       return bridgeWebhook.send({
         content: match[4],
         username: match[2],
         avatarURL: `https://minotar.net/helm/${match[2]}/32`
       });
     }
  }
];

async function minecraft(bot, client, bridgeWebhook, logWebhook) {
  bot.on('login', () => {
    console.log('Joined as ' + bot.username);
    bot.chat("§");
  })
  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;
    if (jsonMsg.match(/Guild > (?:\[(.+)\] )?snailify \[(.+)\]: (.+): (.+)/)) return; //replace this
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, bot);
        break;
      }
    };
  })
  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;
    return logWebhook.send(jsonMsg)
  })
}

module.exports = { minecraft };