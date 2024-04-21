import { verifyCommand, verifyCommandData } from './commands/verify.js';
import { unverifyCommand, unverifyCommandData } from './commands/unverify.js';
import { prefixCommand, prefixCommandData } from './commands/prefix.js'; 
import { checkVerification } from './checkVerification.js';
import { prefixSelect, prefixBuy, prefixEquip } from './commands/prefix.js'
import getGist from './getGist.js'
import discordToMinecraft from './discordToMinecraft.js';

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

  getGist();

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
    discordToMinecraft(bot, client, message, bridgeChannelId);
  });
  client.on('interactionCreate', async interaction => {
    if (interaction.customId == 'prefixSelection') {
      prefixSelect(interaction, interaction.values[0]);
    }

    if (interaction.customId == 'prefixBuy') {
      prefixBuy(interaction);
    }
    if (interaction.customId == 'prefixEquip') {
      prefixEquip(interaction);
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

