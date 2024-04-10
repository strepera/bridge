export default async function(bot, requestedPlayer) {
  if (requestedPlayer !== "jerry" && requestedPlayer !== "spooky") {
     bot.chat("/gc Invalid usage. Use !event {jerry/spooky}.");
     global.lastMessage = ("/gc Invalid usage. Use !event {jerry/spooky}.");
     return;
  }
  await fetch(`https://api.hypixel.net/v2/resources/skyblock/election`)
  .then((response) => response.json())
  .then(async (json) => {
     const now = new Date();
     let timeRemaining;
     if (requestedPlayer === "jerry") {
       let currentYear = json.mayor.election.year + 1;
       const multipliedTime = currentYear * 446400; // 446400 = 5 days 4 hours
       const addedTime = multipliedTime + 1560275700 - 7600;
       const date = new Date(addedTime * 1000);
       timeRemaining = date.getTime() - now.getTime();
       if (timeRemaining < 0) {
         timeRemaining += 446400 * 1000; // Add 5 days and 4 hours to ensure it's in the future
       }
       const jerryDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
       const jerryHours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) - 2;
       bot.chat(`/gc Next jerry event is in ${jerryDays} days and ${jerryHours} hours.`)
       global.lastMessage = (`/gc Next jerry event is in ${jerryDays} days and ${jerryHours} hours.`)
     }
     else if (requestedPlayer === "spooky") {
       let currentYear = json.mayor.election.year + 1;
       const multipliedTime = currentYear * 446400; // 446400 = 5 days
       const addedTime = multipliedTime + 1560275700 - 151200;
       const date = new Date(addedTime * 1000);
       timeRemaining = date.getTime() - now.getTime();
       if (timeRemaining < 0) {
         timeRemaining += 446400 * 1000; // Add 5 days to ensure it's in the future
       }
       const spookyDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
       const spookyHours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
       bot.chat(`/gc Next spooky festival is in ${spookyDays} days and ${spookyHours} hours.`);
       global.lastMessage = (`/gc Next spooky festival is in ${spookyDays} days and ${spookyHours} hours.`);
     }
  });
}; 