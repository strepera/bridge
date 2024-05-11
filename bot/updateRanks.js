export default async function updateRanks(bot, name) {
    const response = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${name}`);
    const json = await response.json();
    let members = json.guild.members;
    for (let member in members) {
      member = members[member];
      let rank = member.rank;
      let totalGEXP = 0;
      for (let day in member.expHistory) {
        totalGEXP += member.expHistory[day];
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
        const response0 = await fetch(`https://api.mojang.com/user/profile/${member.uuid}`);
        const json0 = await response0.json();
        let requestedUsername = json0.name;
        bot.chat(`/g setrank ${requestedUsername} ${newRank}`);
      }
    }
}