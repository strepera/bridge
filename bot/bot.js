import regexes from './regexes.js';
import commands from './commandHandler.js';
import { gameHandler, checkAnswer } from './gameHandler.js';

export async function minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook) {
  gameHandler(bot);
  bot.on('login', () => {
    console.log('Joined as ' + bot.username);
    bot.chat("§"); // send self to limbo
    bot.chat("/g online");
  })
  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;
    let match;
    //log messages
    console.log(jsonMsg);
    logWebhook.send(jsonMsg)
    
    //check for commands
    commands(bot, jsonMsg, match);

    //check for chat games answers
    checkAnswer(bot, jsonMsg);

    //minecraft -> discord handling
    if (jsonMsg.match(/You cannot say the same message twice!/)) {
      bot.chat(global.lastMessage + ' \\\\\\\\');
      global.lastMessage = (global.lastMessage + ' \\\\\\\\');
      return;
    }
    const regexPattern = new RegExp("Guild > (?:\\[(.+)\\] )?" + process.env.botUsername + " \\[(.+)\\]: (.+): (.+)");
    if (jsonMsg.match(regexPattern)) return;
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, punishWebhook);
        break;
      }
    };
  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;

  }) 
  })
}
