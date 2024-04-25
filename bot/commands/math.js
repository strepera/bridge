import * as math from 'mathjs';

export default function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.replaceAll("x","*");
    try {
      const preludes = [
        "The answer to your question is",
        `The answer to ${requestedPlayer} is`,
        `${requestedPlayer} is`,
        "The answer you are looking for is",
        "The solution you're seeking is",
        "Your query resolves to",
        "What you're asking leads to",
        "The result of your question is",
        "The response to your inquiry is",
        "The conclusion to your query is"
      ];
      const answerpreludeindex = Math.floor(Math.random() * preludes.length);
      const answerprelude = preludes[answerpreludeindex];
      const answer = Math.floor(math.evaluate(requestedPlayer) * 1000) / 1000;
      bot.chat(`/gc ${answerprelude} ${answer}`);
      bot.lastMessage = (`/gc ${answerprelude} ${answer}`);
    } catch (err) {
      bot.chat('/gc Sorry, I could not understand the math question.');
      bot.lastMessage = ('/gc Sorry, I could not understand the math question.');
    }
}