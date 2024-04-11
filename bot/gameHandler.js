import { getMathProblem } from "./games/mathProblem.js";
import { getScrambledWord } from "./games/scramble.js";

export async function gameHandler(bot) {
  setInterval(() => {
    getMathProblem(bot);
  }, process.env.gameFrequency * 60 * 1000);
  setTimeout(() => {
    setInterval(() => {
      getScrambledWord(bot);
    }, process.env.gameFrequency * 60 * 1000);
  }, process.env.gameFrequency / 2 * 60 * 1000);
}

export async function checkAnswer(bot, jsonMsg) {
    let match;
    if (jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?TheNoobCode \[(\w+)\]: .*/) && !jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?TheNoobCode \[(\w+)\]: (.+) .*/)) return; // change
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