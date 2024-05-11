const controller = new AbortController();
const signal = controller.signal;

export default async function(bot, requestedPlayer, player, chat) {
  const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/items');
  const data = await response.json();
  let itemFound = false;
  for (let item of data.items) {
      if (item.name.toLowerCase() === requestedPlayer) {
        bot.chat(`${chat}https://wiki.hypixel.net/${item.id}`);
        bot.lastMessage = (`${chat}https://wiki.hypixel.net/${item.id}`);
        itemFound = true;
          break;
      }
  }
  if (!itemFound) {
    const lowercaseWikiPage = requestedPlayer.replaceAll(' ', '_');
    const words = lowercaseWikiPage.split("_");
    for (let i = 0; i < words.length; i++) {
     words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    const wikiPage = words.join("_");
    const response = await fetch(`https://wiki.hypixel.net/${wikiPage}`, { signal });
    if (response.status == 200) {
      bot.chat(`${chat}https://wiki.hypixel.net/${wikiPage}`);
      bot.lastMessage = (`${chat}https://wiki.hypixel.net/${wikiPage}`);
    }
    else {
      const search = requestedPlayer.replaceAll(' ', '%20');
      bot.chat(`${chat}https://wiki.hypixel.net/?search=${search}`);
      bot.lastMessage = (`${chat}https://wiki.hypixel.net/?search=${search}`);
    }
  }
  return null;
}