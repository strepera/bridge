import regexes from './regexes.js';
import commands from './commandHandler.js';
import { gameHandler, checkAnswer } from './gameHandler.js';
import { onlineHandler } from './onlineHandler.js';

export async function minecraft(bot, client, bridgeWebhook, logWebhook, punishWebhook) {
  //initialize game handler
  gameHandler(bot);

  //check for patch notes
  let lastPatchNotes = '';
  setInterval(async () => {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/news?key=${process.env.apiKey}`);
    const json = await response.json();
    if (json.success == true) {
      if (lastPatchNotes == '') {
        lastPatchNotes = json.items[0].link;
      }
      else if (lastPatchNotes != json.items[0].link) {
        bot.chat('/gc NEW UPDATE! ' + json.items[0].link);
        global.lastMessage = ('/gc NEW UPDATE! ' + json.items[0].link);
      }
    }
  }, 5 * 60 * 1000);

  bot.on('login', () => {
    console.log('Joined as ' + bot.username);
    bot.chat("§"); // send self to limbo
    bot.chat("/g online");
  })

  bot.on('messagestr', async (jsonMsg) => {
    if (jsonMsg.trim() == '') return;
    let match;

    //check if the message was blocked
    if (jsonMsg.match(/You cannot say the same message twice!/)) {
      bot.chat(global.lastMessage + ' \\\\\\\\');
      global.lastMessage = (global.lastMessage + ' \\\\\\\\');
      return;
    }
    if (jsonMsg.match(/Advertising is against the rules. You will receive a punishment on the server if you attempt to advertise./)) {
      bridgeWebhook.send(jsonMsg);
      return;
    }

    //log messages
    console.log(jsonMsg);
    logWebhook.send(jsonMsg);

    //check if the message is from the /g online command
    onlineHandler(jsonMsg);
    
    //check for commands
    commands(bot, jsonMsg, match);

    //check for chat games answers
    checkAnswer(bot, jsonMsg);

    //minecraft -> discord handling
    const regexPattern = new RegExp("Guild > (?:\\[(.+)\\] )?" + process.env.botUsername + " \\[(.+)\\]: \\b(\\w+)\\b: (.+)");
    if (jsonMsg.match(regexPattern)) return;
    for (const { regex, func } of regexes) {
      if (match = jsonMsg.match(regex)) {
        func(match, bridgeWebhook, punishWebhook);
        break;
      }
    };
  })
}
