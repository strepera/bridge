async function getTopCandidate() {
  const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/election');
  const data = await response.json();
  let maxVotes = 0;
  let topCandidate = null;
  for (let candidate of data.current.candidates) {
      if (candidate.votes > maxVotes) {
          maxVotes = candidate.votes;
          topCandidate = candidate;
      }
  }
  return topCandidate;
}

export default async function(bot) {
  await fetch(`https://api.hypixel.net/v2/resources/skyblock/election`)
  .then((response) => response.json())
  .then(async (json) => {
    let nextMayorYear;
    let mayorname = json.mayor.name;
    let perkArray = json.mayor.perks;
    let perks = perkArray.map(perk => perk.name).join(', ');
    perks = perks.replace(/EZPZ/g, 'E ZPZ');
    if (!json.current) {
      nextMayorYear = "Not available";
      bot.chat(`/gc Current mayor is ${mayorname} | Perks are ${perks}`)
      global.lastMessage = (`/gc Current mayor is ${mayorname} | Perks are ${perks}`)
    }
    else {
      nextMayorYear = json.current.year;
      const multipliedTime = nextMayorYear * 446400; // 446400 = 5 days 4 hours
      const addedTime = multipliedTime + 1560275700 + 108000;
      const date = new Date(addedTime * 1000);
      const now = new Date();
      const timeRemaining = date.getTime() - now.getTime();
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const topCandidate = await getTopCandidate();
      let topCandidatePerks = topCandidate.perks.map(perk => perk.name).join(', ');
      topCandidatePerks = topCandidatePerks.replace(/EZPZ/g, 'E ZPZ');
      bot.chat(`/gc Current mayor is ${mayorname} | Perks are ${perks} | Next Mayor is ${topCandidate.name} | Perks are ${topCandidatePerks}. They are elected in ${days} days and ${hours} hours.`);
      global.lastMessage = (`/gc Current mayor is ${mayorname} | Perks are ${perks} | Next Mayor is ${topCandidate.name} | Perks are ${topCandidatePerks}. They are elected in ${days} days and ${hours} hours.`);
    }
});
}