import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js";
import getGist from '../getGist.js';
import { prices } from '../prices.js';
import fs from 'fs';

export async function func(interaction) {
  const users = await getGist();
  let prefixes;
  let selectedPrefix;
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
    if (userObj.prefix) {
      selectedPrefix = userObj.prefix;
    }
    else {
      selectedPrefix = 'None';
    }
  }
  else {
    interaction.reply({embeds: [failedEmbed], ephemeral: true});
    return;
  }
  const prefixEmbed = new MessageEmbed()
    .setColor('#1ea863')
    .setTitle('Prefixes')
    .setDescription('You can select your prefix for discord to minecraft chat messages with this command.\nSelect a prefix from the dropdown below to view its info!\n**Prefixes: ' + prefixes + '\nSelected Prefix: ' + selectedPrefix + '**')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
  interaction.reply({embeds: [prefixEmbed], components: [row], ephemeral: true});
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

const failedEmbed = new MessageEmbed()
  .setTitle('Command Failed')
  .setDescription('Please verify to use this command.')
  .setColor('FF0000')
  .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')

export async function displayMainPrefix(interaction) {
  const users = await getGist();
  let prefixes;
  let selectedPrefix;
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
    if (userObj.prefix) {
      selectedPrefix = userObj.prefix;
    }
    else {
      selectedPrefix = 'None';
    }
  }
  else {
    interaction.update({embeds: [failedEmbed]});
    return;
  }
  const prefixEmbed = new MessageEmbed()
    .setColor('#1ea863')
    .setTitle('Prefixes')
    .setDescription('You can select your prefix for discord to minecraft chat messages with this command.\nSelect a prefix from the dropdown below to view its info!\n**Prefixes: ' + prefixes + '\nSelected Prefix: ' + selectedPrefix + '**')
    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
  interaction.update({embeds: [prefixEmbed], components: [row]});
}

export async function prefixSelect(interaction, prefix, prefixes) {
  let button;
  let embed;
  
  const users = await getGist();

  for (const user in users) {
    if (users[user].dcuser == interaction.user.username) {
      if (users[user].prefixes) prefixes = users[user].prefixes;
      let prefixOwned = false;
      let prefixSelected = false;
      if (users[user].prefix == prefix) {
        prefixSelected = true;
      }
      for (const entry in prefixes) {
        if (prefixes[entry] == prefix) {
          prefixOwned = true;
          break;
        }
      }
      if (prefixOwned == true) {
        if (prefixSelected == true) {
          button = new MessageButton()
            .setCustomId('prefixEquip')
            .setLabel('Select Prefix')
            .setStyle('PRIMARY')
            .setDisabled(true)

          embed = new MessageEmbed()
            .setTitle('Prefix: ' + prefix)
            .setColor('#1ea863')
            .setDescription('You have already have this prefix selected!')
            .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        }
        else {
          button = new MessageButton()
            .setCustomId('prefixEquip')
            .setLabel('Select Prefix')
            .setStyle('PRIMARY')

          embed = new MessageEmbed()
            .setTitle('Prefix: ' + prefix)
            .setColor('#1ea863')
            .setDescription('This will select the prefix for use.')
            .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        }
      }
      else {
        button = new MessageButton()
          .setCustomId('prefixBuy')
          .setLabel('Confirm Purchase')
          .setStyle('PRIMARY')
        
        embed = new MessageEmbed()
          .setTitle('Prefix: ' + prefix)
          .setColor('#1ea863')
          .setDescription('This will deduct coins from your account, add the prefix to your inventory and equip it.')
          .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
      }
    }
  }

  if (button) {
    const back = new MessageButton()
      .setCustomId('displayMainPrefix')
      .setLabel('Back')
      .setStyle('PRIMARY')
    const row = new MessageActionRow()
      .addComponents(back, button)
    interaction.update({embeds: [embed], components: [row], ephemeral: true});
    return;
  }
  else {
    interaction.update({embeds: [failedEmbed]})
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
        const data = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
        let json = JSON.parse(data);
        const playerObj = json[player.toLowerCase()];
        if (playerObj.coins >= prices[prefix]) {
          playerObj.coins -= prices[prefix];
        }
        else {
          const embed = new MessageEmbed()
          .setTitle('Error')
          .setDescription('You cannot afford this prefix!')
          .setColor('#ff0000')
          .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
          const back = new MessageButton()
            .setCustomId('displayMainPrefix')
            .setLabel('Back')
            .setStyle('PRIMARY')
           const row = new MessageActionRow()
            .addComponents(back, button)
          interaction.update({embeds: [embed], components: [row]});
          return;
        }
        json[player.toLowerCase()] = playerObj;
        fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(json, null, 2));
        const embed = new MessageEmbed()
        .setTitle('Bought the prefix ' + prefix + '!')
        .setDescription('Deducted $' + prices[prefix].toLocaleString())
        .setColor('#1ea863')
        .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        const back = new MessageButton()
          .setCustomId('displayMainPrefix')
          .setLabel('Back')
          .setStyle('PRIMARY')
         const row = new MessageActionRow()
          .addComponents(back)
        interaction.update({embeds: [embed], components: [row]});
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
        const back = new MessageButton()
          .setCustomId('displayMainPrefix')
          .setLabel('Back')
          .setStyle('PRIMARY')
        const row = new MessageActionRow()
          .addComponents(back)
        const embed = new MessageEmbed()
        .setTitle('Selected Prefix!')
        .setDescription('Set your prefix to " ' + prefix + ' "!')
        .setColor('#1ea863')
        .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        interaction.update({embeds: [embed], components: [row]});
      }
    }

    const patch = JSON.stringify(users, null, 2);
    await getGist(patch);
    return;
}