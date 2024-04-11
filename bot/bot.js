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
    //minecraft -> discord handling
    if (jsonMsg.trim() == '') return;
    if (jsonMsg.match(/You cannot say the same message twice!/)) {
      if (global.lastMessage.includes('\\')) {
        return bridgeWebhook.send({content: 'You cannot say the same message twice!'})
      }
      bot.chat(global.lastMessage + ' \\\\\\\\');
      return;
    }
    if (jsonMsg.match(/Guild > (?:\[(.+)\] )?TheNoobCode \[(.+)\]: (.+): (.+)/)) return; //replace this
    let match;
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, punishWebhook);
        break;
      }
    };

    //check for commands
    commands(bot, jsonMsg, match);

    //check for chat games answers
    checkAnswer(bot, jsonMsg);

    //log messages
    console.log(jsonMsg);
    return logWebhook.send(jsonMsg)
  })
}
