import * as fs from 'fs';

export async function gameHandler(bot) {
  fs.readdir('bot/games', async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const commands = [];
    for (const file of files) {
      const imported = await import (`./games/${file}`)
      commands.push(imported.default || imported);
    }
    for (const command of commands) {
      const frequency = process.env.gameFrequency * 60 * 1000;
      setTimeout(() => {
        setInterval(() => {
          command(bot);
        }, frequency);
      }, frequency * commands.indexOf(command) / commands.length );
      console.log(command, frequency, commands.length)
    }
  })
}

export async function checkAnswer(bot, jsonMsg) {
    let match;
    const regexPattern = new RegExp("Guild > (?:\\[(\\w+\\+?)\\] )?" + process.env.botUsername + " \\[(\\w+)\\]: .*");
    const regexPatternWithoutMessage = new RegExp("Guild > (?:\\[(\\w+\\+?)\\] )?" + process.env.botUsername + " \\[(\\w+)\\]: (.+) .*");
    if (jsonMsg.match(regexPattern) && !jsonMsg.match(regexPatternWithoutMessage)) return;
    if (match = jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?(\w+) \[(\w+)\]: (.+): (.*)/)) {
      if (match[5] == global.mathAnswer) {
        const elapsedTime = Date.now() - global.mathAnswerTimestamp;
        bot.chat(`/gc ${match[4]} got it correct in ${elapsedTime} ms!`);
        global.lastMessage = (`/gc ${match[2]} got it correct in ${elapsedTime} ms!`);
        global.mathAnswer = null;
      }
      else if (match[5].toLowerCase().includes(global.randomItemName)) {
        const elapsedTime = Date.now() - global.randomItemNameTimestamp;
        bot.chat(`/gc ${match[4]} got it correct in ${elapsedTime} ms!`);
        global.lastMessage = (`/gc ${match[4]} got it correct in ${elapsedTime} ms!`);
        global.randomItemName = null;
      }
    }
    else if (match = jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?(\w+) \[(\w+)\]: (.*)/)) {
      if (match[4] == global.mathAnswer) {
        const elapsedTime = Date.now() - global.mathAnswerTimestamp;
        bot.chat(`/gc ${match[2]} got it correct in ${elapsedTime} ms!`);
        global.lastMessage = (`/gc ${match[2]} got it correct in ${elapsedTime} ms!`);
        global.mathAnswer = null;
      }
      else if (match[4].toLowerCase().includes(global.randomItemName)) {
        const elapsedTime = Date.now() - global.randomItemNameTimestamp;
        bot.chat(`/gc ${match[2]} got it correct in ${elapsedTime} ms!`);
        global.lastMessage = (`/gc ${match[2]} got it correct in ${elapsedTime} ms!`);
        global.randomItemName = null;
      }
    }
}
