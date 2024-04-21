import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } from "discord.js";
import fs from 'fs';
import getGist from '../getGist.js';
import { colorPrices } from '../prices.js';
const prices = colorPrices;

const colorRoles = ['White', 'Yellow', 'Green', 'DarkGreen', 'Aqua', 'Cyan', 'Blue', 'Pink', 'Purple', 'Gold', 'Red', 'DarkRed', 'Black'];

async function updateRole(interaction, color) {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const rolesToRemove = await member.roles.cache.filter(role => colorRoles.includes(role.name));
    await member.roles.remove(rolesToRemove);
    const role = interaction.guild.roles.cache.find(role => role.name === color);
    await member.roles.add(role);
}

export async function func(interaction) {
    const users = await getGist();
    let colors;
    let color;
    let userObj;
    for (const user in users) {
      if (users[user].dcuser == interaction.user.username) {
        userObj = users[user];
      }
    }
    if (userObj) {
      if (userObj.colors) {
        colors = [];
        for (const color in userObj.colors) {
          colors.push(userObj.colors[color]);
        }
        colors = colors.join(' ');
      }
      else {
        colors = 'None';
      }
      if (userObj.color) {
        color = userObj.color;
      }
      else {
        color = 'None';
      }
    }
    else {
      interaction.reply({embeds: [new MessageEmbed().setTitle('Command Failed').setDescription('Please verify to use this command.').setColor('FF0000')]});
      return;
    }
    const role = interaction.guild.roles.cache.find(role => role.name === color);
    const roleColor = role ? role.color : '#00ff00';
    const colorEmbed = new MessageEmbed()
      .setColor(roleColor)
      .setTitle('Colors')
      .setDescription('You can select your role color with this command.\nSelect a color from the dropdown below to view its info!\n**Colors: ' + colors + '\nSelected Color: ' + color + '**')
      .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
      .setFooter('The embed color is the role color')
    interaction.reply({embeds: [colorEmbed], components: [row]});
    return;
}

export const data = {
    name: "color",
    description: "Your role colour!"
}

let options = [];

for (const color in prices) {
    options.push({
        label: color,
        description: `${prices[color].toLocaleString()} SnakeCoins`,
        value: color
    })
}

const dropdown = new MessageSelectMenu()
    .setCustomId('colorSelection')
    .setPlaceholder('Choose a color')
    .addOptions(options)

const row = new MessageActionRow()
    .addComponents(dropdown)

export async function colorSelect(interaction, color, colors) {
  let button;
  let embed;
  
  const users = await getGist();

  for (const user in users) {
    if (users[user].dcuser == interaction.user.username) {
      if (users[user].colors) colors = users[user].colors;
      let colorOwned = false;
      for (const entry in users[user].colors) {
        if (users[user].colors[entry] == color) {
          colorOwned = true;
          break;
        }
      }
      if (colorOwned == true) {
        const role = interaction.guild.roles.cache.find(role => role.name === color);
        const roleColor = role ? role.color : '#00ff00';

        button = new MessageButton()
          .setCustomId('colorEquip')
          .setLabel('Select Color')
          .setStyle('PRIMARY')

        embed = new MessageEmbed()
          .setTitle('Color: ' + color)
          .setColor(roleColor)
          .setDescription('This will select the color for use.')
          .setFooter('The embed color is the role color')
      }
      else {
        const role = interaction.guild.roles.cache.find(role => role.name === color);
        const roleColor = role ? role.color : '#00ff00';

        button = new MessageButton()
          .setCustomId('colorBuy')
          .setLabel('Confirm Purchase')
          .setStyle('PRIMARY')
        
        embed = new MessageEmbed()
          .setTitle('Color: ' + color)
          .setColor(roleColor)
          .setDescription('This will deduct coins from your account, add the color to your inventory and equip it.')
          .setFooter('The embed color is the role color')
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

export async function colorBuy(interaction) {
    const color = interaction.message.embeds[0].title.split(' ')[1];
    const dcuser = interaction.user.username;

    const users = await getGist();

    for (const user in users) {
      if (users[user].dcuser == dcuser) {
        const player = users[user].username;
        if (users[user].colors) {
          if (!users[user].colors.includes(color)) {
            users[user].colors.push(color);
          }
          users[user].color = color;
          updateRole(interaction, color);
        }
        else {
          users[user].colors = [];
          users[user].colors.push(color);
          users[user].color = color;
          updateRole(interaction, color);
        }
        const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
        let json = JSON.parse(data);
        const playerObj = json[player.toLowerCase()];
        if (playerObj.coins >= prices[color]) {
          playerObj.coins -= prices[color];
        }
        else {
          interaction.reply({content: 'You cannot afford this color!', ephemeral: true});
          return;
        }
        json[player.toLowerCase()] = playerObj;
        fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
        interaction.reply({content: 'Bought the color " ' + color + ' " for ' + prices[color].toLocaleString() + '!'});
      }
    }

    const patch = JSON.stringify(users, null, 2);
    await getGist(patch);
    return;
}

export async function colorEquip(interaction) {
    const color = interaction.message.embeds[0].title.split(' ')[1];
    const dcuser = interaction.user.username;

    const users = await getGist();

    for (const user in users) {
      if (users[user].dcuser == dcuser) {
        users[user].color = color;
        updateRole(interaction, color);
        interaction.reply({content: 'Set your color to " ' + color + ' "!'});
      }
    }

    const patch = JSON.stringify(users, null, 2);
    await getGist(patch);
    return;
}