import regexes from './regexes.js';
import commands from './commandHandler.js';
import { gameHandler, checkAnswer } from './gameHandler.js';
import { onlineHandler } from './onlineHandler.js';
import { levelHandler } from './levelHandler.js';
import updateRanks from './updateRanks.js';
import checkPatchNotes from './checkPatchNotes.js';
import fs from 'fs';

function generateRandomNonNumericString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const leaves = {};
export const joins = {};

export async function minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook, branch) {

  //initialize game handler
  gameHandler(bot, branch);

  //check for patch notes
  setInterval(async () => {
    checkPatchNotes(bot, branch)
  }, 5 * 60 * 1000);

  // check guild ranks
  setInterval(() => {
    updateRanks(bot, process.env.guild1);
    updateRanks(branch, process.env.guild2);
  }, 6 * 60 * 60 * 1000);

  setTimeout(() => {
    console.log('Joined as ' + bot.username);
    bot.chat("§"); // send self to limbo
    bot.chat('/g online');
    console.log('Joined as ' + branch.username);
    branch.chat("§"); // send self to limbo
    branch.chat('/g online');
  }, 7000);

  bot.on('message', (message) => {
    console.log('NR: ' + message.toAnsi()); //make message colourful
  })

  branch.on('message', (message) => {
    console.log('DN: ' + message.toAnsi()); //make message colourful
  })

  bot.on('messagestr', async (jsonMsg) => {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
      if (match[2] != process.env.botUsername1) {
        let separator = ':';
        const data = global.usersData;
        for (const user in data) {
          if (data[user].username == match[2]) {
            if (data[user].prefix) separator = data[user].prefix;
          }
        }
        branch.chat(('/gc ' + process.env.guild1prefix + match[2] + ' ' + separator + ' ' + match[4]).substring(0, 240));
        branch.lastMessage = ('/gc ' + process.env.guild1prefix + match[2] + ' ' + separator + ' ' + match[4]).substring(0, 240);
      }
    }

    if (match = jsonMsg.match(/^Guild > (\S+) (joined.|left.)/)) {
      if (match[2] == 'joined.') {
        sendJoined(branch, match, process.env.guild1prefix);
      }
      else {
        sendLeft(branch, match, process.env.guild1prefix);
      }
    }

    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) joined the guild!/)) {
      branch.chat('/gc ' + process.env.guild1prefix + match[2] + ' joined the guild! ------------');
      branch.lastMessage = ('/gc ' + process.env.guild1prefix + match[2] + ' joined the guild! ------------');
    }

    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) left the guild!/)) {
      branch.chat('/gc ' + process.env.guild1prefix + match[2] + ' left the guild! ------------');
      branch.lastMessage = ('/gc ' + process.env.guild1prefix + match[2] + ' left the guild! ------------');
    }

    messagestr(jsonMsg, bot, process.env.botUsername1);
    commands(bot, branch, jsonMsg);
    checkAnswer(bot, branch, jsonMsg, process.env.botUsername1);
  })

  branch.on('messagestr', async (jsonMsg) => {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
      if (match[2] != process.env.botUsername2) {
        let separator = ':';
        const data = global.usersData;
        for (const user in data) {
          if (data[user].username == match[2]) {
            if (data[user].prefix) separator = data[user].prefix;
          }
        }
        bot.chat(('/gc ' + process.env.guild2prefix + match[2] + ' ' + separator + ' ' + match[4]).substring(0, 240));
        bot.lastMessage = ('/gc ' + process.env.guild2prefix + match[2] + ' ' + separator + ' ' + match[4]).substring(0, 240);
      }
    }

    if (match = jsonMsg.match(/^Guild > (\S+) (joined.|left.)/)) {
      if (match[2] == 'joined.') {
        sendJoined(bot, match, process.env.guild2prefix);
      }
      else {
        sendLeft(bot, match, process.env.guild2prefix);
      }
    }

    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) joined the guild!/)) {
      bot.chat('/gc ' + process.env.guild2prefix + match[2] + ' joined the guild! ------------');
      bot.lastMessage = ('/gc ' + process.env.guild2prefix + match[2] + ' joined the guild! ------------');
    }

    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) left the guild!/)) {
      bot.chat('/gc ' + process.env.guild2prefix + match[2] + ' left the guild! ------------');
      bot.lastMessage = ('/gc ' + process.env.guild2prefix + match[2] + ' left the guild! ------------');
    }

    messagestr(jsonMsg, branch, process.env.botUsername2);
    commands(branch, bot, jsonMsg);
    checkAnswer(bot, branch, jsonMsg, process.env.botUsername2);
  })

  async function messagestr(jsonMsg, bot, botUsername) {
    if (jsonMsg.trim() == '') return;
    logWebhook.send(jsonMsg);
  
    let match;

    if (match = jsonMsg.match(/(?:\[(\S+)\] )?(\S+) has requested to join the Guild!/)) {
      bot.chat('/g accept ' + match[2]);
    }
  
    //levels
    if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + process.env.botUsername1 + " \\[\\S+\\]: \\b(\\w+)\\b \\S (.+)"))) {
      const player = match[2];
      for (const user of global.usersData) {
        if (user.username == player) {
          levelHandler(bot, player);
          break;
        }
      }
    }
    else if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
      const player = match[2];
      if (player != botUsername) {
        levelHandler(bot, player);
        global.messageCount++;
      };
    }
    if (jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + botUsername + " \\[\\S+\\]: \\[\\S+\\] \\b(\\w+)\\b \\S (.+)"))) return;
  
    //check if the message was blocked
    if (jsonMsg == 'You cannot say the same message twice!' || jsonMsg == 'You are sending commands too fast! Please slow down.' || jsonMsg == 'You can only send a message once every half second!') {
      bot.chat(bot.lastMessage + ' #' + generateRandomNonNumericString(8));
      bot.lastMessage = (bot.lastMessage + ' #' + generateRandomNonNumericString(8));
      return;
    }
    if (jsonMsg == 'Advertising is against the rules. You will receive a punishment on the server if you attempt to advertise.') {
      bridgeWebhook.send('Hypixel Message: ' + jsonMsg);
      return;
    }
  
    //check if the message is from the /g online command
    onlineHandler(jsonMsg);
  
    //minecraft -> discord handling
    const regex1 = new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + botUsername + " \\[\\S+\\]: \\b(\\w+)\\b \\S (.+)");
    if (match = jsonMsg.match(regex1)) {
      for (const user of global.usersData) {
        if (user.username == match[2]) {
          return;
        }
      }
    }
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, punishWebhook, bot);
        break;
      }
    };
  }
}

async function sendJoined(bot, match, prefix) {
  global.onlinePlayers += 1;
  if (!joins[match[1]]) {
    bot.chat(`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    bot.lastMessage = (`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    joins[match[1]] = Date.now();
    return;
  }
  if (Date.now() - joins[match[1]] > 60000) {
    bot.chat(`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    bot.lastMessage = (`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    joins[match[1]] = Date.now();
    return;
  }
}

async function sendLeft(bot, match, prefix) {
  global.onlinePlayers -= 1;
  if (joins[match[1]]) {
    const data = await fs.promises.readFile(`bot/playerData/${match[1].toLowerCase()}.json`, 'utf8');
    const json = JSON.parse(data);
    if (!json[match[1].toLowerCase()].playtime) {
      json[match[1].toLowerCase()].playtime = 0;
    }
    json[match[1].toLowerCase()].playtime += Date.now() - leaves[match[1]];
    fs.writeFileSync(`bot/playerData/${match[1].toLowerCase()}.json`, JSON.stringify(json, null, 2));
  }
  if (!leaves[match[1]]) {
    bot.chat(`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    bot.lastMessage = (`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    leaves[match[1]] = Date.now();
    return;
  }
  if (Date.now() - leaves[match[1]] > 60000) {
    bot.chat(`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    bot.lastMessage = (`/gc ${prefix}${match[1]} ${match[2]} (${global.onlinePlayers}/${global.totalPlayers})`);
    leaves[match[1]] = Date.now();
    return;
  }
}