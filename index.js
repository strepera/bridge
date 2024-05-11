import { minecraft } from './bot/bot.js';
import { discord } from './client/client.js';
import mineflayer from 'mineflayer';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const botOptions = {
  host: "mc.hypixel.net",
  username: process.env.username1,
  auth: "microsoft",
  port: "25565",
  version: "1.20.1"
};

const branchOptions = {
  host: "mc.hypixel.net",
  username: process.env.username2,
  auth: "microsoft",
  port: "25565",
  version: "1.20.1"
}

export let bot = mineflayer.createBot(botOptions);

export let branch = mineflayer.createBot(branchOptions);

bot.on('kicked', err => {
  console.log(err);
  setTimeout(() => {
    bot = mineflayer.createBot(botOptions);
  }, 60 * 1000);
})

branch.on('kicked', err => {
  console.log(err);
  setTimeout(() => {
    branch = mineflayer.createBot(branchOptions);
  }, 60 * 1000);
})

import { Client, Intents, WebhookClient } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT, Intents.FLAGS.GUILD_MEMBERS] });
const bridgeWebhook = new WebhookClient({ id: process.env.bridgeId, token: process.env.bridgeToken})
const logWebhook = new WebhookClient({ id: process.env.logId, token: process.env.logToken})
const punishWebhook = new WebhookClient({ id: process.env.punishId, token: process.env.punishToken})

global.lastMessage = '';

minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook, branch);
discord(bot, client, branch);

client.login(process.env.token);