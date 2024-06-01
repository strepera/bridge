import { MessageEmbed } from "discord.js";
import getGist from '../getGist.js'

async function setNickname(interaction, guild, uuid, username, guildRoleId) {
  const guildResponse = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${guild}`);
  const guildData = await guildResponse.json();
  if (!guildData.guild || !guildData.guild.members) return;
  let memberFound = false;
  for (const member of guildData.guild.members) {
    if (member.uuid == uuid) {
      memberFound = true;
      await interaction.member.setNickname(username + ' ' + toSuperscript(member.rank.toLowerCase())).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set nickname.'));
      await interaction.member.roles.add(guildRoleId).catch(() => console.error(interaction.member.user.username + ' has elevated permissions. Cannot set role.'));
      const role = await interaction.guild.roles.cache.find(r => r.name === 'Verified');
      await interaction.member.roles.add(role).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
      if (member.rank != "Guild Master" && member.rank != "Bot") {
        const role = interaction.guild.roles.cache.find(r => r.name === member.rank);
        if (role) {
          await interaction.member.roles.add(role).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
        } else {
          console.error(`Role not found for rank: ${member.rank}`);
        }
      }
      return;
    }
  }
  if (memberFound) {
    await interaction.member.setNickname(username).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set nickname.'));
  }
  const role = await interaction.guild.roles.cache.find(r => r.name === 'Verified');
  await interaction.member.roles.add(role).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
}

const superscriptMap = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
  "(": "⁽",
  ")": "⁾",
  "n": "ⁿ",
  "x": "ˣ",
  "y": "ʸ",
  "z": "ᶻ",
  "a": "ᵃ",
  "b": "ᵇ",
  "c": "ᶜ",
  "d": "ᵈ",
  "e": "ᵉ",
  "f": "ᶠ",
  "g": "ᵍ",
  "h": "ʰ",
  "i": "ⁱ",
  "j": "ʲ",
  "k": "ᵏ",
  "l": "ˡ",
  "m": "ᵐ",
  "n": "ⁿ",
  "o": "ᵒ",
  "p": "ᵖ",
  "r": "ʳ",
  "s": "ˢ",
  "t": "ᵗ",
  "u": "ᵘ",
  "v": "ᵛ",
  "w": "ʷ",
  "x": "ˣ",
  "y": "ʸ",
  "z": "ᶻ"
}

function toSuperscript(input) {
  let result = '';
  for (let char of input) {
     if (superscriptMap[char]) {
       result += superscriptMap[char];
     } else {
       result += char;
     }
  }
  return result;
} 

async function addRankRole(interaction, uuid) {
    const response1 = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + uuid);
    const data1 = await response1.json();
    const rank = data1.player.newPackageRank;
    if (rank) {
      const rankRole = await interaction.guild.roles.cache.find(r => r.name === rank.replaceAll('_PLUS', '+'));
      await interaction.member.roles.add(rankRole).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
    }
}

export async function func(interaction, options) {
  await interaction.deferReply();
  const dcuser = interaction.user.username;
  let username = options.getString('username');
  const response = await fetch('https://api.mojang.com/users/profiles/minecraft/' + username);
  const data = await response.json();
  const uuid = data.id;
  username = data.name;

  const hypixelResponse = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + uuid);
  const hypixelData = await hypixelResponse.json();
  
  if (!hypixelData.success || !hypixelData.player) {
    return interaction.editReply({
      embeds: [new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Invalid Username')
        .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        .setDescription(`Player \`\`${options.getString('username')}\`\` doesn't exist or doesn't play hypixel.`)]
    });
  }

  if (!hypixelData.player.socialMedia || dcuser != hypixelData.player.socialMedia.links.DISCORD) {
    return interaction.editReply({ embeds: [new MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Error Linking')
      .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
      .setDescription(`Your minecraft linked discord username did not match.
      Type this in minecraft: \`\`${interaction.user.username}\`\`
      Minecraft username: \`\`${username}\`\``)
      .setImage('https://imgur.com/vvegsn6.gif')
      ]});
  }

  if (await updateGist(uuid, interaction, username)) return;

  await interaction.editReply({embeds: [new MessageEmbed()
      .setColor('#1EA863')
      .setTitle('Successfully linked')
      .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
      .setDescription(`**Minecraft:** ${username} \n**Discord:** ${dcuser}\nExample: \`\`/verify ${username}\`\` in this channel to verify.`)
  ]})
  
  await setNickname(interaction, process.env.guild1, uuid, username);
  await setNickname(interaction, process.env.guild2, uuid, username);
  await addRankRole(interaction, uuid);

}

async function updateGist(uuid, interaction, username) {
    const dcuser = interaction.user.username
    const users = await getGist();
    for (let user in users) {
        if (users[user].dcuser == dcuser) {
            const embed =
            new MessageEmbed()
            .setColor('FF0000')
            .setTitle('Error')
            .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
            .setDescription('You are already verified.');
            interaction.editReply({embeds:[embed]});
            return true;
        }
    }

    users.push({
      uuid: uuid,
      dcuser: dcuser,
      username: username
    })
    const updatedContent = JSON.stringify(users, null, 2);
    await getGist(updatedContent);
}

export const data = {
    name: "verify",
    description: "Links your minecraft account and discord account!",
    options: [{
        name: "username",
        type: "STRING",
        description: "username",
        required: true
    }]
}