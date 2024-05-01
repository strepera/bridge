const ranks = ['Member', 'Danger Noodle', 'Elite', 'Ironman', 'Bot', 'Guild Master'];

export default async function(bot, requestedPlayer) {
  const name = bot.username == process.env.botUsername1 ? process.env.guild1 : process.env.guild2
  requestedPlayer = requestedPlayer.split(" ")[0];
  const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json0 = await response0.json();
  let uuid = json0.id;
  requestedPlayer = json0.name;
  const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${name}`);
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
  if (totalGEXP >= 100000) {
    if (totalGEXP >= 200000) {
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
    bot.chat(`/gc  ${requestedPlayer} joined ${joinDate}. 100k gexp for danger noodle, 200k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
    bot.lastMessage = (`/gc  ${requestedPlayer} joined ${joinDate}. 100k gexp for danger noodle, 200k for elite. Their gexp this week is ${totalGEXP.toLocaleString()}.`);
  }, 250);
}
