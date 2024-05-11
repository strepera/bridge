const ranks = ['Member', 'Snek', 'Danger Noodle', 'Nope Rope', 'Bot', 'Guild Master'];

export default async function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  const response0 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json0 = await response0.json();
  let uuid = json0.id;
  requestedPlayer = json0.name;
  if (!uuid) {
    bot.chat("Invalid player.");
    global.lastMessage = ("Invalid player.");
  }
  const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&player=${uuid}`);
  const json = await response.json();
  if (!json.success || !json.guild) {
    bot.chat("/gc Invalid player.");
    bot.lastMessage = ("/gc Invalid player.");
  }
  let members = json.guild.members;
  let totalGEXP = 0;
  let rank;
  let joinDate;
  const guildName = json.guild.name;
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

  let newRank;
  if (totalGEXP >= 40000) {
    if (totalGEXP >= 100000) {
      if (totalGEXP >= 200000) {
        newRank = 'Nope Rope';
      }
      else {
        newRank = 'Danger Noodle';
      }
     }
     else {
      newRank = 'Snek';
     }
  }
  else {
    newRank = 'Member';
  }
   if (newRank != rank) {
    bot.chat(`/g setrank ${requestedPlayer} ${newRank}`);
  }
  setTimeout(() => {
    bot.chat(`/gc  ${requestedPlayer} joined ${joinDate}. Their gexp this week is ${totalGEXP.toLocaleString()}. (${guildName})`);
    bot.lastMessage = (`/gc  ${requestedPlayer} joined ${joinDate}. Their gexp this week is ${totalGEXP.toLocaleString()}. (${guildName})`);
  }, 250);
}