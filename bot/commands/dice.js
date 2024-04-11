export default async function(bot) {
  bot.chat('/gc The dice rolled ' + Math.round(Math.random() * (6-1) + 1));
  global.lastMessage = '/gc The dice rolled ' + Math.round(Math.random() * (6-1) + 1);
}
