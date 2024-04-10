export default async function(bot) {
  bot.chat('The dice rolled ' + Math.round(Math.random() * (6-1) + 1));
  global.lastMessage = 'The dice rolled ' + Math.round(Math.random() * (6-1) + 1);
}