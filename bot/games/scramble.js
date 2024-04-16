String.prototype.shuffleWords = function () {
  return this.split(' ')
           .map(word => word.split('').sort(() => 0.5 - Math.random()).join(''))
           .join(' ');
}

export default async function getScrambledWord(bot) {
  const response = await fetch('https://api.hypixel.net/v2/resources/skyblock/items');
  const data = await response.json();
  const items = data.items;
  const randomItemId = items[Math.floor(Math.random() * items.length)];
  global.randomItemName = randomItemId.name;
  const shuffledItemName = global.randomItemName.shuffleWords();
  console.log("Answer: " + global.randomItemName);
  bot.chat("/gc Unscramble! | " + shuffledItemName);
  global.lastMessage = ("/gc Unscramble! | " + shuffledItemName);
  global.randomItemName = global.randomItemName.toLowerCase();
  global.randomItemNameTimestamp = Date.now();
  setTimeout(() => {
   if (global.randomItemName) {
    bot.chat('/gc No one answered in time! The answer was "' + global.randomItemName + '"');
    global.lastMessage = ('/gc No one answered in time! The answer was "' + global.randomItemName + '"');
    delete global.randomItemName;
   }
   }, 30 * 1000);
}

export async function check(answer, player, bot) {
  answer = answer.replaceAll('undefined', ' ');
  if (answer.toLowerCase().includes(global.randomItemName)) {
    const elapsedTime = Date.now() - global.randomItemNameTimestamp;
    bot.chat(`/gc ${player} got it correct in ${elapsedTime} ms!`);
    global.lastMessage = (`/gc ${player} got it correct in ${elapsedTime} ms!`);
    delete global.randomItemName;
  }
}