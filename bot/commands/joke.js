export default async function(bot) {
  await fetch('https://soopy.dev/api/sbgBot/joke.json')
      .then((response) => response.json())
      .then((json) => {
        bot.chat('/gc ' + json.data.setup);
        bot.lastMessage = ('/gc ' + json.data.setup);
        setTimeout(() => {
          bot.chat('/gc ' + json.data.punchline);
          bot.lastMessage = ('/gc ' + json.data.punchline);
        }, 5000);
      })
}