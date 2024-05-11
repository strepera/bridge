import { MessageEmbed } from "discord.js";

let onlinePlayersCount = 0;
let totalPlayersCount = 0;

const regexes = [
  {
    regex: /^(?:\[(\S+)\] )?(\S+) joined the guild!/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      global.totalPlayers += 1;
      const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('New Guild Member!')
      .setDescription(`${player} joined the guild!`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) left the guild!/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      global.totalPlayers -= 1;
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Guild Member Left.')
      .setDescription(`${player} left the guild!`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/,
    func: (match, bridgeWebhook, punishWebhook, bot) => {
      let content = match[4].replaceAll('@everyone', 'everyone').replaceAll('@here', 'here');
      if (!content.includes('https:')) content = content.replaceAll('_', '\\_');
      const message = match[0];
      const player = match[2];
      if (match = message.match(new RegExp("^Guild > (?:\\[\\S+\\] )?" + process.env.botUsername1 + " \\[(\\S+)\\]: (.+)"))) {
        const output = match[2];
        if (output.match(/^(\S+) \S (.+)/)) return;
        if (output.includes(' ⤷ ')) return;
        if (output.split(' ')[0].match(/(QUICK|Unscramble)/)) {
          const title = output.split(' ')[0] == 'QUICK' ? 'Quick Maths!' : 'Unscramble!'
          const embed = new MessageEmbed()
          .setTitle(title)
          .setDescription(output)
          .setColor('#00ff00')
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Danger Noodles',
            avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
          })
          return;
        }
        if (match = output.match(/^(\S+) got it correct in (\S+) ms!/)) {
          const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Game ended!')
          .setDescription(match[1] + ' won in ' + match[2] + ' ms!')
          .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Danger Noodles',
            avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
          })
          return;
        }
        if (match = output.match(/^No one answered in time! The answer was "(.+)"/)) {
          const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Game ended!')
          .setDescription('The answer was ' + match[1] + '!')
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Danger Noodles',
            avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
          })
          return;
        }
        if (output.startsWith(process.env.guild2prefix)) { // make configurable
          const status = output.split(' ')[2];
          if (status == 'joined.') {
            const player = output.split(' ')[1].replaceAll('_', '\\_');
            const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle(`${player} joined! (${global.onlinePlayers}/${global.totalPlayers})`)
            .setDescription('Welcome!')
            .setThumbnail(`https://minotar.net/helm/${output.split(' ')[1]}/32`)
            bridgeWebhook.send({
              embeds: [embed],
              username: 'Danger Noodles',
              avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
            })
            return;
          }
          else if (status == 'left.') {
            const player = output.split(' ')[1].replaceAll('_', '\\_');
            const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`${player} left. (${global.onlinePlayers}/${global.totalPlayers})`)
            .setDescription('Goodbye!')
            .setThumbnail(`https://minotar.net/helm/${output.split(' ')[1]}/32`)
            bridgeWebhook.send({
              embeds: [embed],
              username: 'Danger Noodles',
              avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
            })
            return;
          }
          else if (status == 'joined') return; // guild join
          else if (status == 'left') return; // guild leave
        }
        const embed = new MessageEmbed()
        .setTitle('Command: .' + bot.lastCommand)
        .setDescription(output)
        .setColor('#00ff00')
        bridgeWebhook.send({
          embeds: [embed],
          username: 'Danger Noodles',
          avatarURL: 'https://cdn.discordapp.com/avatars/1232984080740515853/e0416e61f64c3d1659a271228e398fdd.png?size=256?size=512'
        })
        return;
      }
      else if (match = message.match(new RegExp("^Guild > (?:\\[\\S+\\] )?" + process.env.botUsername2 + " \\[(\\S+)\\]: (.+)"))) {
        const output = match[2];
        if (output.match(/^(\S+) \S (.+)/)) return;
        if (output.includes(' ⤷ ')) return;
        if (output.split(' ')[0].match(/(QUICK|Unscramble)/)) {
          const title = output.split(' ')[0] == 'QUICK' ? 'Quick Maths!' : 'Unscramble!'
          const embed = new MessageEmbed()
          .setTitle(title)
          .setDescription(output)
          .setColor('#00ff00')
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Nope Ropes',
            avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
          })
          return;
        }
        if (match = output.match(/^(\S+) got it correct in (\S+) ms!/)) {
          const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Game ended!')
          .setDescription(match[1] + ' won in ' + match[2] + ' ms!')
          .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Nope Ropes',
            avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
          })
          return;
        }
        if (match = output.match(/^No one answered in time! The answer was "(.+)"/)) {
          const embed = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Game ended!')
          .setDescription('The answer was ' + match[1] + '!')
          bridgeWebhook.send({
            embeds: [embed],
            username: 'Nope Ropes',
            avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
          })
          return;
        }
        if (output.startsWith(process.env.guild1prefix)) { // make configurable
          const status = output.split(' ')[2];
          if (status == 'joined.') {
            const player = output.split(' ')[1].replaceAll('_', '\\_');
            const embed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle(`${player} joined! (${global.onlinePlayers}/${global.totalPlayers})`)
            .setDescription('Welcome!')
            .setThumbnail(`https://minotar.net/helm/${output.split(' ')[1]}/32`)
            bridgeWebhook.send({
              embeds: [embed],
              username: 'Nope Ropes',
              avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
            })
            return;
          }
          else if (status == 'left.') {
            const player = output.split(' ')[1].replaceAll('_', '\\_');
            const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`${player} left. (${global.onlinePlayers}/${global.totalPlayers})`)
            .setDescription('Goodbye!')
            .setThumbnail(`https://minotar.net/helm/${output.split(' ')[1]}/32`)
            bridgeWebhook.send({
              embeds: [embed],
              username: 'Nope Ropes',
              avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
            })
            return;
          }
          else if (status == 'joined') return; // guild join
          else if (status == 'left') return; // guild leave
        }
        const embed = new MessageEmbed()
        .setTitle('Command: .' + bot.lastCommand)
        .setDescription(output)
        .setColor('#00ff00')
        bridgeWebhook.send({
          embeds: [embed],
          username: 'Nope Ropes',
          avatarURL: 'https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512'
        })
        return;
      }
      bridgeWebhook.send({
         content: content,
         username: player,
         avatarURL: `https://minotar.net/helm/${player}/32`
      });
      return;
    }
  },
  {
    regex: /^Online Members: (.+)/,
    func: (match) => {
      onlinePlayersCount += 1;
      if (onlinePlayersCount < 3) {
        if (onlinePlayersCount == 1) {
          global.onlinePlayers = Number(match[1]);
        }
        else {
          global.onlinePlayers += Number(match[1]);
        }
      }
    }
  },
  {
    regex: /^Total Members: (.+)/,
    func: (match) => {
      totalPlayersCount += 1;
      if (totalPlayersCount < 3) {
        if (totalPlayersCount == 1) {
          global.totalPlayers = Number(match[1]);
        }
        else {
          global.totalPlayers += Number(match[1]);
        }
      }
    }
  },
  {
    regex: /^The Guild has reached Level (\d+)!/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Guild Level Up!')
      .setDescription(`Guild level ${Number(match[1]) - 1} ➡ ${match[1]}`)
      punishWebhook.send({
        embeds: [embed],
      })
      bridgeWebhook.send({
        embeds: [embed],
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) was promoted from (.+) to (.+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${player} was promoted!`)
      .setDescription(`${match[3]} to ${match[4]}`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) was demoted from (.+) to (.+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player} was demoted!`)
      .setDescription(`${match[3]} to ${match[4]}`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) has muted the guild chat for (.+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player} muted the guild chat!`)
      .setDescription(`Duration: ${match[3]}`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) has unmuted the guild chat!/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player = match[2].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${player} unmuted the guild chat!`)
      .setThumbnail(`https://minotar.net/helm/${match[2]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) has muted (?:\[(\S+)\] )?(\S+) for (.+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player1 = match[2].replaceAll('_', '\\_');
      const player2 = match[4].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player2} was muted!`)
      .setDescription(`Duration: ${match[5]} \nby ${player1}`)
      .setThumbnail(`https://minotar.net/helm/${match[4]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) has unmuted (?:\[(\S+)\] )?(\S+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player1 = match[2].replaceAll('_', '\\_');
      const player2 = match[4].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player2} was unmuted!`)
      .setDescription(`by ${player1}`)
      .setThumbnail(`https://minotar.net/helm/${match[4]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /^(?:\[(\S+)\] )?(\S+) was kicked from the guild by (?:\[(\S+)\] )?(\S+)/,
    func: (match, bridgeWebhook, punishWebhook) => {
      const player1 = match[2].replaceAll('_', '\\_');
      const player2 = match[4].replaceAll('_', '\\_');
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player1} has been kicked from the guild!`)
      .setDescription(`by ${player2}`)
      .setThumbnail(`https://minotar.net/helm/${match[4]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      punishWebhook.send({
        embeds: [embed],
        username: match[2],
        avatarURL: `https://minotar.net/helm/${match[2]}/32`
      })
      return;
    }
  },
  {
    regex: /(?:\[(\S+)\] )?(\S+) has invited you to join their party!/,
    func: (match, bridgeWebhook, punishWebhook, bot) => {
      const player = match[2];
      bot.chat('/p ' + player);
      if (global.inParty != true) {
      setTimeout(() => {
        bot.chat('/p leave');
      }, 1000);
      setTimeout(() => {
        bot.chat('/p invite ' + player);
        global.inParty = true;
      }, 3000);
    }
      return;
    }
  },
  {
    regex: /^The party was disbanded because all invites expired and the party was empty./,
    func: (match, bridgeWebhook, punishWebhook, bot) => {
      global.inParty = false;
    }
  }
];

export default regexes;
