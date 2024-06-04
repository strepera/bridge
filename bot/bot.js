import regexes from './regexes.js';
import commands from './commandHandler.js';
import { gameHandler, checkAnswer } from './gameHandler.js';
import { onlineHandler } from './onlineHandler.js';
import { levelHandler } from './levelHandler.js';
import updateRanks from './updateRanks.js';
import checkPatchNotes from './checkPatchNotes.js';

function generateRandomNonNumericString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
        branch.chat(process.env.guild1prefix + match[2] + ' : ' + match[4]);
        branch.lastMessage = (process.env.guild1prefix + match[2] + ' : ' + match[4]);
      }
    }
    if (match = jsonMsg.match(/^Guild > (\S+) (joined.|left.)/)) {
      global.onlinePlayers = match[2] == 'joined.' ? global.onlinePlayers += 1 : global.onlinePlayers -= 1;
      branch.chat(process.env.guild1prefix + match[1] + ' ' + match[2] + ' (' + global.onlinePlayers + '/' + global.totalPlayers + ')');
      branch.lastMessage = (process.env.guild1prefix + match[1] + ' ' + match[2] + ' (' + global.onlinePlayers + '/' + global.totalPlayers + ')');
    }
    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) joined the guild!/)) {
      branch.chat(process.env.guild1prefix + match[2] + ' joined the guild!');
      branch.lastMessage = (process.env.guild1prefix + match[2] + ' joined the guild!');
    }
    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) left the guild!/)) {
      branch.chat(process.env.guild1prefix + match[2] + ' left the guild!');
      branch.lastMessage = (process.env.guild1prefix + match[2] + ' left the guild!');
    }
    commands(bot, branch, jsonMsg);
    checkAnswer(bot, branch, jsonMsg, process.env.botUsername1);
    messagestr(jsonMsg, bot, process.env.botUsername1);
  })

  branch.on('messagestr', async (jsonMsg) => {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: (.+)/)) {
      if (match[2] != process.env.botUsername2) {
        bot.chat(process.env.guild2prefix + match[2] + ' : ' + match[4]);
        bot.lastMessage = (process.env.guild2prefix + match[2] + ' : ' + match[4]);
      }
    }
    if (match = jsonMsg.match(/^Guild > (\S+) (joined.|left.)/)) {
      global.onlinePlayers = match[2] == 'joined.' ? global.onlinePlayers += 1 : global.onlinePlayers -= 1;
      bot.chat(process.env.guild2prefix + match[1] + ' '+ match[2] + ' (' + global.onlinePlayers + '/' + global.totalPlayers + ')');
      bot.lastMessage = (process.env.guild2prefix + match[1] + ' ' + match[2] + ' (' + global.onlinePlayers + '/' + global.totalPlayers + ')');
    }
    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) joined the guild!/)) {
      bot.chat(process.env.guild2prefix + match[2] + ' joined the guild!');
      bot.lastMessage = (process.env.guild2prefix + match[2] + ' joined the guild!');
    }
    if (match = jsonMsg.match(/^(?:\[(\S+)\] )?(\S+) left the guild!/)) {
      bot.chat(process.env.guild2prefix + match[2] + ' left the guild!');
      bot.lastMessage = (process.env.guild2prefix + match[2] + ' left the guild!');
    }
    commands(branch, bot, jsonMsg);
    checkAnswer(bot, branch, jsonMsg, process.env.botUsername2);
    messagestr(jsonMsg, branch, process.env.botUsername2);
  })

  async function messagestr(jsonMsg, bot, botUsername) {
    if (jsonMsg.trim() == '') return;
    logWebhook.send(jsonMsg);
  
    let match;

    if (match = jsonMsg.match(/(?:\[(\S+)\] )?(\S+) has requested to join the Guild!/)) {
      bot.chat('/g accept ' + match[2]);
    }
  
    //levels
    if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + botUsername + " \\[\\S+\\]: \\b(\\w+)\\b \\S (.+)"))) {
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
    if (jsonMsg == 'You cannot say the same message twice!' || jsonMsg == 'You are sending commands too fast! Please slow down.') {
      bot.chat(bot.lastMessage + ' @' + generateRandomNonNumericString(8));
      bot.lastMessage = (bot.lastMessage + ' @' + generateRandomNonNumericString(8));
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
