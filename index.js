import { minecraft } from './bot/bot.js';
import { discord } from './client/client.js';
import mineflayer from 'mineflayer';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { Client, Intents, WebhookClient } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
const bridgeWebhook = new WebhookClient({ id: process.env.bridgeId, token: process.env.bridgeToken})
const logWebhook = new WebhookClient({ id: process.env.logId, token: process.env.logToken})
const punishWebhook = new WebhookClient({ id: process.env.punishId, token: process.env.punishToken})

global.lastMessage = '';
global.messageCount = 0;

export let bot;
export let branch;
function createBot() {
  bot = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: process.env.username1,
    auth: "microsoft",
    port: "25565",
    version: "1.20"
  });

  branch = mineflayer.createBot({
    host: "mc.hypixel.net",
    username: process.env.username2,
    auth: "microsoft",
    port: "25565",
    version: "1.20"
  });

}
createBot();

bot.on('error', (err) => console.log(err));
branch.on('error', (err) => console.log(err));
bot.on('kick', (reason) => console.log(reason));
branch.on('kick', (reason) => console.log(reason));

bot.once('login', () => {
  minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook, branch);
})

discord(bot, client, branch);

client.login(process.env.token);