String.prototype.shuffleWords = function () {
  return this.split(' ')
           .map(word => word.split('').sort(() => 0.5 - Math.random()).join(''))
           .join(' ');
}

export async function getScrambledWord(bot) {
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
   if (global.randomItemName != null) {
    bot.chat('/gc No one answered in time! The answer was "' + global.randomItemName + '"');
    global.lastMessage = ('/gc No one answered in time! The answer was "' + global.randomItemName + '"');
    global.randomItemId = null;
   }
   }, 30 * 1000);
}
