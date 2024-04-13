import { MessageEmbed } from "discord.js";

const regexes = [
  {
    regex: /Guild > (\w+) joined./,
    func: (match, bridgeWebhook) => {
      const player = match[1].replaceAll('_', '\\_');
      global.onlinePlayers += 1;
      const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle(`${player} joined! (${global.onlinePlayers}/${global.totalPlayers})`)
      .setDescription('Welcome!')
      .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[1],
        avatarURL: `https://minotar.net/helm/${match[1]}/32`
      })
      return;
    }
  },
  {
    regex: /Guild > (\w+) left./,
    func: (match, bridgeWebhook) => {
      const player = match[1].replaceAll('_', '\\_');
      global.onlinePlayers -= 1;
      const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`${player} left. (${global.onlinePlayers}/${global.totalPlayers})`)
      .setDescription('Goodbye!')
      .setThumbnail(`https://minotar.net/helm/${match[1]}/32`)
      bridgeWebhook.send({
        embeds: [embed],
        username: match[1],
        avatarURL: `https://minotar.net/helm/${match[1]}/32`
      })
      return;
    }
  },
  {
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) joined the guild!/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) left the guild!/,
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
    regex: /Guild > (?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) \[(\w+\+?)\]: (.+)/,
    func: (match, bridgeWebhook) => {
      let content = match[4].replaceAll('@everyone', 'everyone').replaceAll('@here', 'here').replaceAll('_', '\\_');
      bridgeWebhook.send({
         content: content,
         username: match[2],
         avatarURL: `https://minotar.net/helm/${match[2]}/32`
      });
      return;
    }
  },
  {
    regex: /Online Members: (.+)/,
    func: (match) => {
      return global.onlinePlayers = Number(match[1]);
    }
  },
  {
    regex: /Total Members: (.+)/,
    func: (match) => {
      return global.totalPlayers = Number(match[1]);
    }
  },
  {
    regex: /The Guild has reached Level \d+!/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) was promoted from (.+) to (.+)/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) was demoted from (.+) to (.+)/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) has muted the guild chat for (.+)/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) has unmuted the guild chat!/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) has muted (?:\[(\w+\+?)\] )?(\w+) for (.+)/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) has unmuted (?:\[(\w+\+?)\] )?(\w+)/,
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
    regex: /(?:\[(\w+(?:\+{1,2})\w*)\] )?(\w+) was kicked from the guild by (?:\[(\w+\+?)\] )?(\w+)/,
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
  }
];

export default regexes;
