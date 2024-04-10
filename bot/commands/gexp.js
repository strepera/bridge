import { apiKey } from "../config.js";

const ranks = ['Member', 'Danger Noodle', 'Elite', 'Ironman', 'Bot', 'Guild Master'];

export default async function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  if (requestedPlayer == 'all') {
    const response = await fetch(`https://api.hypixel.net/v2/guild?key=${apiKey}&name=Nope%20Ropes`);
    const json = await response.json();
    let members = json.guild.members;
    for (let member in members) {
      member = members[member];
      let rank = member.rank;
      let totalGEXP = 0;
      for (let day in member.expHistory) {
        totalGEXP += member.expHistory[day];
      }
      if (rank != 'Ironman') {
        let newRank;
        if (totalGEXP >= 125000) {
          if (totalGEXP >= 250000) {
            newRank = 'Elite';
          }
          else {
            newRank = 'Danger Noodle';
          }
          if (ranks.indexOf(newRank) > ranks.indexOf(rank)) {
            const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
            const json0 = await response0.json();
            let requestedUsername = json0.name;
            bot.chat(`/g setrank ${requestedUsername} ${newRank}`);
          }
         }
         const json1 = await fetchJson(`https://api.hypixel.net/v2/skyblock/profiles?key=${apiKey}&uuid=${member.uuid}`);
         if (json1.success == true) {
           for (profile in json1.profiles) {
             if (profile.game_mode == 'ironman') {
               const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
               const json0 = await response0.json();
               let name = json0.name;
               bot.chat(`/g setrank ${name} ironman`);
             }
           }
         }
        }
    }
  }
  else {
  const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json0 = await response0.json();
  let uuid = json0.id;
  requestedPlayer = json0.name;
  const response = await fetch(`https://api.hypixel.net/v2/guild?key=${apiKey}&name=Nope%20Ropes`);
  const json = await response.json();
  let members = json.guild.members;
  let totalGEXP = 0;
  let rank;
  let joinDate;
  for (let member in members) {
    member = members[member];
    if (member.uuid == uuid) {
    joinDate = new Date(member.joined).toLocaleDateString();
    rank = member.rank;
    for (let day in member.expHistory) {
      totalGEXP += member.expHistory[day];
    }
   }
  }
  if (rank !== 'Ironman') {
  let newRank;
  if (totalGEXP >= 125000) {
    if (totalGEXP >= 250000) {
      newRank = 'Elite';
    }
    else {
      newRank = 'Danger Noodle';
    }
    if (ranks.indexOf(newRank) > ranks.indexOf(rank)) {
      bot.chat(`/g setrank ${requestedPlayer} ${newRank}`);
    }
   }
  }
  setTimeout(() => {
    bot.chat(`/gc  ${requestedPlayer} joined ${joinDate}. 125k gexp for danger noodle, 250k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
    global.lastMessage = (`/gc  ${requestedPlayer} joined ${joinDate}. 125k gexp for danger noodle, 250k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
  }, 250);
 }
}