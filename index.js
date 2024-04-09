const { username, token, bridgeToken, bridgeId, logToken, logId } = require('./config.js'); 
const { minecraft } = require('./bot/bot.js');
const { discord } = require('./client/client.js');

const mineflayer = require('mineflayer');
const bot = mineflayer.createBot({
  host: "mc.hypixel.net",
  username: username,
  auth: "microsoft",
  port: "25565",
  version: "1.8.9"
});

const { Client, Intents, WebhookClient } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILD_MEMBERS] });
const bridgeWebhook = new WebhookClient({ id: bridgeId, token: bridgeToken})
const logWebhook = new WebhookClient({ id: logId, token: logToken})

global.lastMessage = '';

minecraft(bot, client, bridgeWebhook, logWebhook);
discord(bot, client);

client.login(token);