import { minecraft } from './bot/bot.js';
import { discord } from './client/client.js';
import mineflayer from 'mineflayer';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const bot = mineflayer.createBot({
  host: "mc.hypixel.net",
  username: "micahkoritz666@gmail.com",
  auth: "microsoft",
  port: "25565",
  version: "1.8.9"
});

import { Client, Intents, WebhookClient } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILD_MEMBERS] });
const bridgeWebhook = new WebhookClient({ id: process.env.bridgeId, token: process.env.bridgeToken})
const logWebhook = new WebhookClient({ id: process.env.logId, token: process.env.logToken})
const punishWebhook = new WebhookClient({ id: process.env.punishId, token: process.env.punishToken})

global.lastMessage = '';
global.onlinePlayers = 0;
global.totalPlayers = 0;

minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook);
discord(bot, client);

client.login(process.env.token);
