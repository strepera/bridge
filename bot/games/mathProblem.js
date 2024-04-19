import fs from 'fs'

export default async function getMathProblem(bot, message) {
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
  global.lastMessage = (message);
  global.mathAnswerTimestamp = Date.now();
  setTimeout(() => {
    if (global.mathAnswer) {
     bot.chat('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     global.lastMessage = ('/gc No one answered in time! The answer was "' + global.mathAnswer + '"');
     delete global.mathAnswer;
    }
  }, 30 * 1000);
}

export async function check(answer, player, bot) {
  answer = answer.replaceAll('undefined', ' ');
  if (answer == global.mathAnswer) {
    const elapsedTime = Date.now() - global.mathAnswerTimestamp;
    bot.chat(`/gc ${player} got it correct in ${elapsedTime} ms!`);
    global.lastMessage = (`/gc ${player} got it correct in ${elapsedTime} ms!`);
    let playerObj;
    const data = await fs.promises.readFile('bot/playerData.json', 'utf8');
    let json = JSON.parse(data);
    playerObj = json[player.toLowerCase()];
    playerObj.coins += 2500;
    json[player.toLowerCase()] = playerObj;
    fs.writeFileSync('bot/playerData.json', JSON.stringify(json, null, 2));
    delete global.mathAnswer;
  }
}