import * as emoji from 'node-emoji';
import emojiRegex from 'emoji-regex';
import { verifyCommand, verifyCommandData } from './commands/verify.js';
import { unverifyCommand, unverifyCommandData } from './commands/unverify.js';
import { prefixCommand, prefixCommandData } from './commands/prefix.js'; 
import { checkVerification } from './checkVerification.js';
import { prices } from './prices.js';
import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import fs from 'fs';

function replaceEmojisWithNames(str) {
  const regex = emojiRegex();
  return str.replace(regex, (match) => {
      const name = emoji.which(match);
      return name ? `:${name}:` : match;
  });
}

async function formatMessage(message) {
  if (message.stickers.size > 0) {
    const newMsg = `:${message.stickers.first().name}:`;
    return newMsg
  }
 
  let newMsg = message.content.replace(/<@(\d+)>/g, (match, userId) => {
    const mention = message.guild.members.cache.get(userId);
    return mention ? `@${mention.displayName}` : match;
  }).replace(/\n/g, ' ').replace(/\bez\b/g, "e.z");
 
  newMsg = replaceEmojisWithNames(newMsg);
 
  if (message.attachments) {
    message.attachments.forEach(attachment => {
      newMsg += ` ${attachment.url}`;
    })
  }
 
  return newMsg;
}

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

const commands = {
  'verify': verifyCommand,
  'unverify': unverifyCommand
}

export async function discord(bot, client, welcomeChannel, bridgeChannelId) {

  const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
    method: 'GET',
    headers: {
        'Authorization': `token ${process.env.gistKey}`,
        'Accept': 'application/vnd.github.v3+json'
    }
  });
  const gistData = await response.json();
  global.usersData = JSON.parse(gistData.files['users.json'].content);

  client.on('ready', async () => {
    console.log('Logged in as ' + client.user.tag);
    const guild = await client.guilds.fetch(process.env.guildId);
    await guild.commands.create(verifyCommandData);
    await guild.commands.create(unverifyCommandData);
    await guild.commands.create(prefixCommandData);
    await guild.commands.create({
      name: "online",
      description: "Shows you who's online ingame!"
    });
    await guild.commands.create({
      name: "say",
      description: "for snail",
      options: [{
          name: "message",
          type: "STRING",
          description: "message",
          required: true
      }]
    })
    const response = await fetch(`https://discord.com/api/webhooks/${process.env.bridgeId}/${process.env.bridgeToken}`);
    const json = await response.json();
    welcomeChannel = client.channels.cache.get(process.env.welcomeChannelId);
    bridgeChannelId = json.channel_id;
    setInterval(() => {
      client.user.setActivity(`${global.onlinePlayers} players!`, {type: "WATCHING"});
    }, 60 * 1000);
    setInterval(() => {
      guild.members.fetch()
          .then(members => {
              members.forEach(member => checkVerification(member))
          })
    }, 3 * 60 * 60 * 1000);
  });
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channelId != bridgeChannelId) return;
    let user = '';
    const member = await message.guild.members.fetch(message.author.id)
    let separator = ':';
    for (let userData in global.usersData) {
      userData = global.usersData[userData];
      if (userData.username == member.nickname) {
        if (userData.prefix) separator = userData.prefix;
      }
    }
    if (message.reference && message.reference.messageId) {
      const repliedChannel = await client.channels.cache.get(message.reference.channelId);
      const repliedMessage = await repliedChannel.messages.fetch(message.reference.messageId);
      const repliedContent = await formatMessage(repliedMessage);
      if (repliedMessage.webhookId) {
        user += `${repliedMessage.author.username}: ${repliedContent} ⤷ `;
      }
      else user += `${repliedMessage.member.displayName}: ${repliedContent} ⤷ `;
    }
    user += member.displayName;
    const msg = await formatMessage(message);
    let combined = `${user} ${separator} ${msg}`;
    if (combined.length > 240) {
      combined = combined.substring(0,240);
    }
    bot.chat(`/gc ${combined}`);
    global.lastMessage = (`/gc ${combined}`);
  });
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'prefixSelection') {
      prefixBuy(interaction, interaction.values[0]);
    }

    if (interaction.customId == 'prefixBuy') {
      const prefix = interaction.message.embeds[0].title.split(' ')[1];
      const dcuser = interaction.user.username;

      const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${process.env.gistKey}`,
            'Accept': 'application/vnd.github.v3+json'
        }
      });
      const gistData = await response.json();
      const users = JSON.parse(gistData.files['users.json'].content);

      for (const user in users) {
        if (users[user].dcuser == dcuser) {
          const player = users[user].username;
          if (users[user].prefixes) {
            users[user].prefixes.push(prefix);
          }
          else {
            users[user].prefixes = [];
            users[user].prefixes.push(prefix);
            users[user].prefix = prefix;
          }
          let playerObj;
          const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
          let json = JSON.parse(data);
          playerObj = json[player.toLowerCase()];
          if (playerObj.coins >= prices[prefix]) {
            playerObj.coins -= prices[prefix];
          }
          else {
            interaction.reply({content: 'You cannot afford this prefix!', ephemeral: true});
            return;
          }
          json[player.toLowerCase()] = playerObj;
          fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
          interaction.reply({content: 'Bought the prefix " ' + prefix + ' " for ' + prices[prefix].toLocaleString() + '!', ephemeral: true});
        }
      }
 
      await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${process.env.gistKey}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'users.json': {
                    content: JSON.stringify(users, null, 2)
                }
            }
        })
    });
    const response0 = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
      method: 'GET',
      headers: {
          'Authorization': `token ${process.env.gistKey}`,
          'Accept': 'application/vnd.github.v3+json'
      }
    });
    const gistData0 = await response0.json();
    global.usersData = JSON.parse(gistData0.files['users.json'].content);
    }
    if (interaction.customId == 'prefixEquip') {
      const prefix = interaction.message.embeds[0].title.split(' ')[1];
      const dcuser = interaction.user.username;

      const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${process.env.gistKey}`,
            'Accept': 'application/vnd.github.v3+json'
        }
      });
      const gistData = await response.json();
      const users = JSON.parse(gistData.files['users.json'].content);

      for (const user in users) {
        if (users[user].dcuser == dcuser) {
          users[user].prefix = prefix;
          interaction.reply({content: 'Set your prefix to " ' + prefix + ' "!', ephemeral: true});
        }
      }
 
      await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${process.env.gistKey}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                'users.json': {
                    content: JSON.stringify(users, null, 2)
                }
            }
        })
    });
    const response0 = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
      method: 'GET',
      headers: {
          'Authorization': `token ${process.env.gistKey}`,
          'Accept': 'application/vnd.github.v3+json'
      }
    });
    const gistData0 = await response0.json();
    global.usersData = JSON.parse(gistData0.files['users.json'].content);
    }
    if (!interaction.isCommand()) return;
    const { commandName, options } = interaction;
    try {
    if (commandName == 'say') {
      if (interaction.user.id != process.env.ownerId) return;
      bot.chat(options.getString('message'));
      interaction.reply(options.getString('message') + ' sent!');
    }
    else if (commandName == 'online') {
      bot.chat('/g online');
      checkOnlineEmbed(interaction);
    }
    else if (commandName == 'prefix') {
      prefixCommand(interaction);
    }
    else {
      commands[commandName](interaction, options.getString('username'));
    }
    }
    catch(e) {
      console.error(e)
    }
  })
  client.on('guildMemberAdd', async(member) => {
    await welcomeChannel.send('Welcome <@' + member.user.id + '>!');
    checkVerification(member);
  });
  
   client.on('guildMemberRemove', async(member) => {
    await welcomeChannel.send('Goodbye ' + member.user.username);
  });
}

async function prefixBuy(interaction, prefix, prefixes) {
  let button;
  let embed;
  
  for (const user in global.usersData) {
    if (global.usersData[user].dcuser == interaction.user.username) {
      if (global.usersData[user].prefixes) prefixes = global.usersData[user].prefixes;
      let prefixOwned = false;
      for (const entry in global.usersData[user].prefixes) {
        if (global.usersData[user].prefixes[entry] == prefix) {
          prefixOwned = true;
          break;
        }
      }
      if (prefixOwned == true) {
        button = new MessageButton()
          .setCustomId('prefixEquip')
          .setLabel('Select Prefix')
          .setStyle('PRIMARY')

        embed = new MessageEmbed()
          .setTitle('Prefix: ' + prefix)
          .setDescription('This will select the prefix for use.')
      }
      else {
        button = new MessageButton()
          .setCustomId('prefixBuy')
          .setLabel('Confirm Purchase')
          .setStyle('PRIMARY')
        
        embed = new MessageEmbed()
          .setTitle('Prefix: ' + prefix)
          .setDescription('This will deduct coins from your account and add the prefix to your inventory.')
      }
    }
  }

  const row = new MessageActionRow()
    .addComponents(button)
  interaction.reply({embeds: [embed], components: [row], ephemeral: true});
}