import { apiKey } from "../config.js";

export default async function(bot, requestedPlayer) {
  if (requestedPlayer > 15) {
    bot.chat('/gc Request exceeds maximum limit of 15 users.');
    global.lastMessage = ('/gc Request exceeds maximum limit of 15 users.');
    return;
  }
  const response = await fetch(`https://api.hypixel.net/guild?key=${apiKey}&id=5d072c6b77ce842c1e4df9ea`); // nope ropes guild id
  const guildResponse = await response.json();
  const members = guildResponse.guild.members;
  let randomMembers = [];
 
  for(let i = 0; i < requestedPlayer; i++) {
    const randomMemberUuid = members[Math.floor(Math.random() * members.length)].uuid;
    const response = await fetch(`https://api.mojang.com/user/profile/${randomMemberUuid}`);
    const userResponse = await response.json();
    randomMembers.push(userResponse.name);
  }
  bot.chat(`/gc Random users are ${randomMembers.join(', ')}`);
  global.lastMessage = (`/gc Random users are ${randomMembers.join(', ')}`);
}