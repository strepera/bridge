const readability = {
  'farming_1': 'Barn Islands',
  'foraging_1': 'Park',
  'mining_1': 'Gold Mine',
  'mining_2': 'Deep Caverns',
  'mining_3': 'Dwarven Mines',
  'combat_1': "Spider's Den",
  'combat_3': 'End',
  'dynamic': 'Private Island'
}

import { bot as main } from '../../index.js';
import { branch as branch } from '../../index.js';

export default async function(bot, requestedPlayer, player, chat) {
  if (requestedPlayer == player) {
    if (bot.username == process.env.botUsername1) {
      branch.chat('/g online');
    }
    else {
      main.chat('/g online');
    }
    async function checkOnlineEmbed() {
      console.log(global.onlineEmbed);
      if (global.onlineEmbed != undefined) {
        bot.chat(chat + global.onlineEmbed.name + ' (' + global.onlineEmbed.online + '/' + global.onlineEmbed.total + ')');
        bot.lastMessage = (chat + global.onlineEmbed.name + ' (' + global.onlineEmbed.online + '/' + global.onlineEmbed.total + ')');
        bot.chat('/t ' + player + ' Players: ' + global.onlineEmbed.players.join(', '));
        bot.lastMessage = ('/t ' + player + ' Players: ' + global.onlineEmbed.players.join(', '));
        delete global.onlineEmbed;
        return;
      }
      else {
        setTimeout(async () => {
          await checkOnlineEmbed();
        }, 500);
      }
    }
    await checkOnlineEmbed();
    return;
  }
  let uuid;
  requestedPlayer = requestedPlayer.split(' ')[0];
  try {
      const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
      const json1 = await response1.json();
      uuid = json1.id;
      const response2 = await fetch(`https://api.hypixel.net/status?key=${process.env.apiKey}&uuid=${uuid}`);
      const json2 = await response2.json();
      if (json2.success === true) {
        if (json2.session.gameType) {
          let gameType = json2.session.gameType;
          let mode = json2.session.mode;
          if (readability[mode]) {
              mode = readability[mode];
          }
          mode = mode.replaceAll('_', ' ');
          let modeParts = mode.split(' ');
          for (let part in modeParts) {
              modeParts[part] = modeParts[part][0].toUpperCase() + modeParts[part].slice(1);
          }
          mode = modeParts.join(' ');
          bot.chat(`${chat}${requestedPlayer} is in ${gameType} - ${mode}`);
          bot.lastMessage = (`${chat}${requestedPlayer} is in ${gameType} - ${mode}`);
        }
        else {
            bot.chat(`${chat}${requestedPlayer} is offline.`);
            bot.lastMessage = (`${chaT}${requestedPlayer} is offline.`);
        }
      }
      else {
        bot.chat(chat + 'Invalid player.');
        bot.lastMessage = (chat + 'Invalid player.');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}
