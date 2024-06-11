import fs from 'fs'

export default async function getMathProblem(bot, branch, message) {
  const chosenOperator = Math.random() < 0.5 ? '+' : '*';
  if (chosenOperator == '+') {
    let num1 = Math.floor(Math.random() * 100);
    let num2 = Math.floor(Math.random() * 100);
    if (num1 == 0 || num2 == 0) {
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * 100);
    }
    global.mathAnswer = (num1 + num2).toString();
    message = `/gc QUICK MATH for 2.5k coins! | What is ${num1} + ${num2}?`;
  }
  else {
    let num1 = Math.floor(Math.random() * 100);
    let num2 = Math.floor(Math.random() * 10);
    if (num1 == 0 || num2 == 0) {
      num1 = Math.floor(Math.random() * 100);
      num2 = Math.floor(Math.random() * 10);
    }
    global.mathAnswer = (num1 * num2).toString();
    message = `/gc QUICK MATH for 2.5k coins! | What is ${num1} * ${num2}?`;
  }
  console.log('Answer:', global.mathAnswer);
  bot.chat(message);
  bot.lastMessage = (message);
  branch.chat(message);
  branch.lastMessage = (message);
  global.mathAnswerTimestamp = Date.now();
  setTimeout(() => {
    if (global.mathAnswer) {
     bot.chat('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     bot.lastMessage = ('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     branch.chat('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     branch.lastMessage = ('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     delete global.mathAnswer;
    }
  }, 30 * 1000);
}

export async function check(answer, player, bot) {
  answer = answer.replaceAll('undefined', ' ');
  if (answer.includes(global.mathAnswer)) {
    const elapsedTime = Date.now() - global.mathAnswerTimestamp;
    bot.chat(`/gc ${player} got it correct in ${elapsedTime} ms!`);
    bot.lastMessage = (`/gc ${player} got it correct in ${elapsedTime} ms!`);
    let playerObj;
    const data = await fs.promises.readFile(`bot/playerData/${player.toLowerCase()}.json`, 'utf8');
    let json = JSON.parse(data);
    playerObj = json[player.toLowerCase()];
    if (playerObj) {
      playerObj.coins += 2500 * Math.floor(elapsedTime / 30000);
    } else playerObj = { "coins": 2500 * Math.floor(elapsedTime / 30000), "messageCount": 1, "username": player }
    json[player.toLowerCase()] = playerObj;
    fs.writeFileSync(`bot/playerData/${player.toLowerCase()}.json`, JSON.stringify(json, null, 2));
    delete global.mathAnswer;
  }
}