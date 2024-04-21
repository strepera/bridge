import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js";
import getGist from '../getGist.js';
import { prices } from '../prices.js';
import fs from 'fs';

export async function func(interaction) {
  const users = await getGist();
  let prefixes;
  let userObj;
  for (const user in users) {
    if (users[user].dcuser == interaction.user.username) {
      userObj = users[user];
    }
  }
  if (userObj) {
    if (userObj.prefixes) {
      prefixes = [];
      for (const prefix in userObj.prefixes) {
        prefixes.push(userObj.prefixes[prefix]);
      }
      prefixes = prefixes.join(' ');
    }
    else {
      prefixes = 'None';
    }
  }
  else {
    interaction.reply({embeds: [new MessageEmbed().setTitle('Command Failed').setDescription('Please verify to use this command.').setColor('FF0000')]});
    return;
  }
  const prefixEmbed = new MessageEmbed()
    .setColor('#1ea863')
    .setTitle('Prefixes')
    .setDescription('You can select your prefix for discord to minecraft chat messages with this command.\nSelect a prefix from the dropdown below to view its info!\n**Prefixes: ' + prefixes + '**')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
  interaction.reply({embeds: [prefixEmbed], components: [row]});
  return;
}

export const data = {
    name: "prefix",
    description: "Your discord to minecraft chat separator!"
}

let options = [];

for (const symbol in prices) {
    options.push({
        label: symbol,
        description: `${prices[symbol].toLocaleString()} SnakeCoins`,
        value: symbol
    })
}

const dropdown = new MessageSelectMenu()
    .setCustomId('prefixSelection')
    .setPlaceholder('Choose a prefix')
    .addOptions(options)

const row = new MessageActionRow()
    .addComponents(dropdown)

export async function prefixSelect(interaction, prefix, prefixes) {
  let button;
  let embed;
  
  const users = await getGist();

  for (const user in users) {
    if (users[user].dcuser == interaction.user.username) {
      if (users[user].prefixes) prefixes = users[user].prefixes;
      let prefixOwned = false;
      for (const entry in users[user].prefixes) {
        if (users[user].prefixes[entry] == prefix) {
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
          .setDescription('This will deduct coins from your account, add the prefix to your inventory and equip it.')
      }
    }
  }

  if (button) {
    const row = new MessageActionRow()
      .addComponents(button)
    interaction.reply({embeds: [embed], components: [row], ephemeral: true});
    return;
  }
  else {
    interaction.reply({embeds: [new MessageEmbed().setTitle('Command Failed').setDescription('Please verify to use this command.').setColor('FF0000')]})
    return;
  }
}

export async function prefixBuy(interaction) {
    const prefix = interaction.message.embeds[0].title.split(' ')[1];
    const dcuser = interaction.user.username;

    const users = await getGist();

    for (const user in users) {
      if (users[user].dcuser == dcuser) {
        const player = users[user].username;
        if (users[user].prefixes) {
          users[user].prefixes.push(prefix);
          users[user].prefix = prefix;
        }
        else {
          users[user].prefixes = [];
          users[user].prefixes.push(prefix);
          users[user].prefix = prefix;
        }
        const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
        let json = JSON.parse(data);
        const playerObj = json[player.toLowerCase()];
        if (playerObj.coins >= prices[prefix]) {
          playerObj.coins -= prices[prefix];
        }
        else {
          interaction.reply({content: 'You cannot afford this prefix!', ephemeral: true});
          return;
        }
        json[player.toLowerCase()] = playerObj;
        fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
        interaction.reply({content: 'Bought the prefix " ' + prefix + ' " for ' + prices[prefix].toLocaleString() + '!'});
      }
    }

    const patch = JSON.stringify(users, null, 2);
    await getGist(patch);
    return;
}

export async function prefixEquip(interaction) {
    const prefix = interaction.message.embeds[0].title.split(' ')[1];
    const dcuser = interaction.user.username;

    const users = await getGist();

    for (const user in users) {
      if (users[user].dcuser == dcuser) {
        users[user].prefix = prefix;
        interaction.reply({content: 'Set your prefix to " ' + prefix + ' "!'});
      }
    }

    const patch = JSON.stringify(users, null, 2);
    await getGist(patch);
    return;
}