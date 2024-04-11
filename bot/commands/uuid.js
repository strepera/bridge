export default async function(bot, requestedPlayer) {
  await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`)
    .then((response) => response.json())
    .then((json) => {
      let uuid = json.id;
      bot.chat(`/gc ${requestedPlayer}'s uuid is ${uuid}`);
      global.lastMessage = (`/gc ${requestedPlayer}'s uuid is ${uuid}`);
  })
}