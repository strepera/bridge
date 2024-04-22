import * as emoji from 'node-emoji';
import emojiRegex from 'emoji-regex';

export default async function discordToMinecraft(bot, client, message, bridgeChannelId) {
    if (message.author.bot) return;
    if (message.channelId != bridgeChannelId) return;
    let user = '';
    const member = await message.guild.members.fetch(message.author.id);
    const nickname = member.displayName.split(' ')[0];
    let separator = ':';
    const data = global.usersData;
    for (const user in data) {
      if (data[user].username == nickname) {
        if (data[user].prefix) separator = data[user].prefix;
      }
    }
    if (message.reference && message.reference.messageId) {
      const repliedChannel = await client.channels.cache.get(message.reference.channelId);
      const repliedMessage = await repliedChannel.messages.fetch(message.reference.messageId);
      const repliedContent = await formatMessage(repliedMessage);
      if (repliedMessage.webhookId) {
        user += `${repliedMessage.author.username}: ${repliedContent} ⤷ `;
      }
      else user += `${repliedMessage.member.displayName.split(' ')[0]}: ${repliedContent} ⤷ `;
    }
    user += nickname;
    const msg = await formatMessage(message);
    let combined = `${user} ${separator} ${msg}`;
    if (combined.length > 240) {
      combined = combined.substring(0,240);
    }
    bot.chat(`/gc ${combined}`);
    global.lastMessage = (`/gc ${combined}`);
}

function replaceEmojisWithNames(str) {
    const regex = emojiRegex();
    return str.replace(regex, (match) => {
        const name = emoji.which(match);
        return name ? `:${name}:` : match;
    });
  }
  
  async function formatMessage(message) {
    if (message.stickers.size > 0) {
      const newMsg = `:${message.stickers.first().name}:`;
      return newMsg
    }
   
    let newMsg = message.content.replace(/<@(\d+)>/g, (match, userId) => {
      const mention = message.guild.members.cache.get(userId);
      return mention ? `@${mention.displayName.split(' ')[0]}` : match;
    }).replace(/\n/g, ' ').replace(/\bez\b/g, "e.z");
   
    newMsg = replaceEmojisWithNames(newMsg);
   
    if (message.attachments) {
      message.attachments.forEach(attachment => {
        newMsg += ` ${attachment.url}`;
      })
    }
   
    return newMsg;
  }