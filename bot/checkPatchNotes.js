let lastPatchNotes = '';

export default async function(bot, branch) {
    const response = await fetch(`https://api.hypixel.net/v2/skyblock/news?key=${process.env.apiKey}`);
    const json = await response.json();
    if (json.success == true) {
      if (lastPatchNotes == '') {
        lastPatchNotes = json.items[0].link;
      }
      else if (lastPatchNotes != json.items[0].link) {
        bot.chat('/gc NEW UPDATE! ' + json.items[0].link);
        branch.chat('/gc NEW UPDATE! ' + json.items[0].link);
        lastPatchNotes = json.items[0].link;
      }
    }
}