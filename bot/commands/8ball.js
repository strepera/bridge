const answers = ["It is certain", "Reply hazy, try again", "Don’t count on it", "It is decidedly so", "Ask again later", "My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good", "You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

export default async function ball(bot, requestedPlayer, player, chat) {
  let answerIndex = Math.floor(Math.random() * answers.length);
  let ballmessage = answers[answerIndex];
  return (`${chat}8ball> ${ballmessage}`);
}