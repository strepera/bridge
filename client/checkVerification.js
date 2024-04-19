const givenRoles = [
  'VIP',
  'VIP+',
  'MVP',
  'MVP+',
  'Verified',
  'Member',
  'Danger Noodle',
  'Elite',
  'Ironman'
]

export async function checkVerification(member) {
  let checkedRoles = [];
  let ironman = false;
  const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
      method: 'GET',
      headers: {
          'Authorization': `token ${process.env.gistKey}`,
          'Accept': 'application/vnd.github.v3+json'
      }
  });
  const gistData = await response.json();
  global.usersData = JSON.parse(gistData.files['users.json'].content);
  const users = JSON.parse(gistData.files['users.json'].content);
  const user = users.find(user => user.dcuser === member.user.username);
  if (user) {
      const response0 = await fetch('https://api.mojang.com/user/profile/' + user.uuid);
      const data0 = await response0.json();
      const username = data0.name;
      console.log(member.user.username + ' is already linked to ' + username);
      await member.setNickname(username).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set nickname.'));
      const role = member.guild.roles.cache.find(r => r.name === 'Verified');
      await member.roles.add(role).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
      checkedRoles.push('Verified');
      try {
          const response0 = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=Nope%20Ropes`);
          const data0 = await response0.json();
          if (data0.guild && data0.guild.members) {
             for (let guildMember in data0.guild.members) {
               if (data0.guild.members[guildMember].uuid == user.uuid) {
                 if (data0.guild.members[guildMember].rank != "Guild Master" && data0.guild.members[guildMember].rank != "Bot") {
                  const role = member.guild.roles.cache.find(r => r.name === data0.guild.members[guildMember].rank);
                  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${user.uuid}`);
                  const json2 = await response2.json();
                  if (json2.success == true) {
                    for (let profile in json2.profiles) {
                      if (json2.profiles[profile].game_mode == 'ironman' && json2.profiles[profile].selected == true) {
                        const ironmanRole = member.guild.roles.cache.find(r => r.name === 'Ironman');
                        await member.roles.add(ironmanRole).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
                        checkedRoles.push('Ironman');
                        ironman = true;
                        if (data0.guild.members[guildMember].rank != 'Ironman') {
                          bot.chat('/g setrank ' + username + ' ironman');
                        }
                      }
                    }
                  }
                  if (ironman == false) {
                   if (role) {
                     if (data0.guild.members[guildMember].rank == 'Ironman') {
                      const eliteRole = await member.guild.roles.cache.find(r => r.name === 'Elite');
                      await member.roles.add(eliteRole).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
                      checkedRoles.push('Elite');
                      bot.chat('/g setrank ' + username + ' elite');
                     }
                     else {
                      await member.roles.add(role).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
                      checkedRoles.push(data0.guild.members[guildMember].rank)
                     }
                   } else {
                     console.error(`Role not found for rank: ${data0.guild.members[guildMember].rank}`);
                   }
                  }
                 }
               }
             }
          } else {
             console.error('Guild or guild members not found in API response');
          }
      }
      catch (e) {
        console.error(e);
      }
      try {
          const response1 = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + user.uuid);
          const data1 = await response1.json();
          const rank = data1.player.newPackageRank;
          const role1 = await member.guild.roles.cache.find(r => r.name === rank.replaceAll('_PLUS', '+'));
          await member.roles.add(role1).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot set role.'));
          checkedRoles.push(rank.replaceAll('_PLUS', '+'))
      } catch (e) {
          console.error(e);
      }
      console.log(checkedRoles);
      member.roles.cache.forEach(role => {
        if (givenRoles.includes(role.name) && !checkedRoles.includes(role.name)) {
          member.roles.remove(role).catch(() => console.error(member.user.username + ' has elevated permissions. Cannot remove role.'));
        }
      })
  }
  console.log('Checked verification status for: ' + member.user.username + ' (' + member.user.id + ')');
}
