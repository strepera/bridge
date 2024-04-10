import { apiKey } from "../config.js";

export default async function(bot) {
  await fetch(`https://api.hypixel.net/v2/skyblock/news?key=${apiKey}`)
  .then((response) => response.json())
  .then((json) => {
    bot.chat('/gc ' + json.items[0].link);
    global.lastMessage = ('/gc ' + json.items[0].link);
  })

}