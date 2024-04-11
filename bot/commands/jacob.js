export default async function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`)
  const json = await response.json();
  let uuid = json.id;
  requestedPlayer = json.name;

  const response1 = await fetch(`https://api.elitebot.dev/Weight/${uuid}`);
  const json1 = await response1.json();
  let profileId = json1.selectedProfileId;
  let totalWeight;
  for (let profile of json1.profiles) {
   if (profile.profileId === profileId) {
     totalWeight = Math.floor(profile.totalWeight);
     break;
   }
  }

  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
  const json2 = await response2.json();
  let uniqueGolds;
  if (json2.success === true && json2.profiles !== null) {
    let selectedProfileId;
    let profileData;
    for (let profile of json2.profiles) {
      if (profile.selected === true) {
        selectedProfileId = profile.profile_id;
        profileData = profile.members[uuid];
        uniqueGolds = profileData?.jacobs_contest.unique_brackets?.gold?.length;
        if (uniqueGolds == undefined) {
          uniqueGolds = 0;
        }
        break;
      }
    }
  }

  bot.chat(`/gc Stats for ${requestedPlayer} | Weight; ${totalWeight} | Unique Golds; ${uniqueGolds}/10`)
  global.lastMessage = (`/gc Stats for ${requestedPlayer} | Weight; ${totalWeight} | Unique Golds; ${uniqueGolds}/10`);
}
