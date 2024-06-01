import getGist from './getGist.js';
import fs from 'fs';

const givenRoles = [
  'Nope Ropes',
  'Danger Noodles',
  'VIP',
  'VIP+',
  'MVP',
  'MVP+',
  'Verified',
  'Member',
  'Snek',
  'Danger Noodle',
  'Nope Rope'
]

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

async function setNickname(member, guild, uuid, username, guildRoleId, checkedRoles) {
  const guildResponse = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${guild}`);
  const guildData = await guildResponse.json();
  if (!guildData.guild || !guildData.guild.members) return;
  let memberFound = false;
  for (const guildMember of guildData.guild.members) {
    if (guildMember.uuid == uuid) {
      memberFound = true;
      await member.setNickname(username + ' ' + toSuperscript(guildMember.rank.toLowerCase())).catch(() => console.error(member.username + ' has elevated permissions. Cannot set nickname.'));
      await member.roles.add(guildRoleId).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
      checkedRoles.push(guild.replaceAll('%20', ' '));
      const role = await member.guild.roles.cache.find(r => r.name === 'Verified');
      await member.roles.add(role).catch(() => console.error(member.username + ' has elevated permissions. Cannot set role.'));
      checkedRoles.push('Verified');
      if (guildMember.rank != "Guild Master" && guildMember.rank != "Bot") {
        const role = member.guild.roles.cache.find(r => r.name === guildMember.rank);
        if (role) {
          await member.roles.add(role).catch(() => console.error(member.username + ' has elevated permissions. Cannot set role.'));
          checkedRoles.push(guildMember.rank);
        } else {
          console.error(`Role not found for rank: ${member.rank}`);
        }
      }
      return checkedRoles;
    }
  }
  if (memberFound) {
    await member.setNickname(username).catch(() => console.error(member.username + ' has elevated permissions. Cannot set nickname.'));
  }
  const role = await member.guild.roles.cache.find(r => r.name === 'Verified');
  await member.roles.add(role).catch(() => console.error(member.username + ' has elevated permissions. Cannot set role.'));
  checkedRoles.push('Verified');
  return checkedRoles;
}

export async function checkVerification(member, bot, branch) {
  let checkedRoles = [];
  const users = await getGist();
  const user = users.find(user => user.dcuser === member.user.username);

  if (!user) return;

  const mojangResponse = await fetch('https://api.mojang.com/user/profile/' + user.uuid);
  const mojangData = await mojangResponse.json();
  const username = mojangData.name;

  if (mojangData.id == user.uuid && mojangData.name != user.username) {
    const oldName = user.username;
    users[users.indexOf(user)].username = mojangData.name;
    await getGist(JSON.stringify(users));

    const lowerName = mojangData.name.toLowerCase();

    const playerData = JSON.parse(await fs.promises.readFile('bot/playerData.json', 'utf8'));
    if (playerData[oldName.toLowerCase()]) {
      playerData[oldName.toLowerCase()].username = lowerName;
    }
    playerData[lowerName] = playerData[oldName.toLowerCase()];
    if (playerData[oldName.toLowerCase()]) {
      delete playerData[oldName.toLowerCase()];
    }
    fs.writeFileSync('bot/playerData.json', JSON.stringify(playerData, null, 2));
  }

  checkedRoles = await setNickname(member, process.env.guild1, user.uuid, username, process.env.guild1role, checkedRoles);
  checkedRoles = await setNickname(member, process.env.guild2, user.uuid, username, process.env.guild2role, checkedRoles);

  const playerResponse = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + user.uuid);
  const playerData = await playerResponse.json();
  const rank = playerData.player.newPackageRank;
  if (rank) {
    const rankRole = await member.guild.roles.cache.find(r => r.name === rank.replaceAll('_PLUS', '+'));
    await member.roles.add(rankRole).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
    checkedRoles.push(rank.replaceAll('_PLUS', '+'));
  }

  member.roles.cache.forEach(role => {
    if (givenRoles.includes(role.name) && !checkedRoles.includes(role.name)) {
      member.roles.remove(role).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot remove role.'));
    }
  })

  console.log('Checked verification status for: ' + member.user.username + ' (' + member.user.id + ')');
  console.log(checkedRoles);

}
