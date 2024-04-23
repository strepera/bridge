import * as fs from 'fs';

const commands = [];

export async function gameHandler(bot) {
  fs.readdir('bot/games', async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    for (const file of files) {
      const imported = await import (`./games/${file}`)
      commands.push(imported);
    }
    for (const command of commands) {
      const frequency = process.env.gameFrequency * 60 * 1000;
      setTimeout(() => {
        setInterval(() => {
          command.default(bot);
        }, frequency);
      }, frequency * commands.indexOf(command) / commands.length );
      console.log('Imported:');
      console.log(command)
    }
  })
}

export async function checkAnswer(bot, jsonMsg) {
    let match;
    const mcRegex = new RegExp("Guild > (?:\\[(\\w+\\+?)\\] )?" + process.env.botUsername + " \\[(\\w+)\\]: .*");
    const dcRegex = new RegExp("Guild > (?:\\[(\\w+\\+?)\\] )?" + process.env.botUsername + " \\[(\\w+)\\]: (.+) .*");
    if (jsonMsg.match(mcRegex) && !jsonMsg.match(dcRegex)) return;
    if (match = jsonMsg.match(/Guild > (?:\[(.+\+?)\] )?(\w+) \[(\w+)\]: (.+) \S (.*)/)) {
      for (const command of commands) {
        command.check(match[5], match[4], bot);
      }
    }
    else if (match = jsonMsg.match(/Guild > (?:\[(.+\+?)\] )?(\w+) \[(\w+)\]: (.*)/)) {
      for (const command of commands) {
        command.check(match[4], match[2], bot);
      }
    }
}
