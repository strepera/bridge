import { bridgeId, bridgeToken } from '../config.js';
import * as emoji from 'node-emoji';
import emojiRegex from 'emoji-regex';

function replaceEmojisWithNames(str) {
  const regex = emojiRegex();
  return str.replace(regex, (match) => {
      const name = emoji.which(match);
      return name ? `:${name}:` : match;
  });
}

async function formatMessage(message) {
  if (message.stickers.size > 0) {
    return newMsg = `:${message.stickers.first().name}:`;
  }

  let newMsg = message.content.replace(/<@(\d+)>/g, (match, userId) => {
    const mention = message.guild.members.cache.get(userId);
    return mention ? `@${mention.displayName}` : match;
  }).replace(/\n/g, ' ').replaceAll(" ez ", " e.z ");

  newMsg = replaceEmojisWithNames(newMsg);

  if (message.attachments) {
    message.attachments.forEach(attachment => {
      newMsg += ` ${attachment.url}`;
    })
  }

  return newMsg;
}

export async function discord(bot, client) {
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
    let user = '';
    const member = await message.guild.members.fetch(message.author.id)
    if (message.reference && message.reference.messageId) {
      const repliedChannel = await client.channels.cache.get(message.reference.channelId);
      const repliedMessage = await repliedChannel.messages.fetch(message.reference.messageId);
      const repliedContent = await formatMessage(repliedMessage);
      if (repliedMessage.webhookId) {
        user += `${repliedMessage.author.username}: ${repliedContent} ⤷ `;
      }
      else user += `${repliedMessage.member.displayName}: ${repliedContent} ⤷ `;
    }
    user += member.displayName;
    const msg = await formatMessage(message);
    let combined = user + ': ' + msg
    if (combined.length > 240) {
      combined = combined.substring(0,240);
    }
    bot.chat(`/gc ${combined}`);
    global.lastMessage = (`/gc ${combined}`);
  });
}
