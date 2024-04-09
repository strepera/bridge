const { bridgeId, bridgeToken } = require('../config.js')

async function discord(bot, client) {
  let bridgeChannelId;
  client.on('ready', async () => {
    console.log('Logged in as ' + client.user.tag);
    const response = await fetch(`https://discord.com/api/webhooks/${bridgeId}/${bridgeToken}`);
    const json = await response.json();
    bridgeChannelId = json.channel_id;
  });
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channelId != bridgeChannelId) return;
    bot.chat(`/gc ${message.author.username}: ${message.content}`);
    global.lastMessage = (`/gc ${message.author.username}: ${message.content}`);
  });
}

module.exports = { discord };