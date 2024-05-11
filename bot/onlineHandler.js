import { MessageEmbed } from 'discord.js';

let onlineMessage = false;
let onlineArray = [];

const boldMessages = [
  'Guild Name: ',
  '--',
  'Total Members: ',
  'Online Members: ',
  'Offline Members: '
]

export async function onlineHandler(jsonMsg) {
    if (jsonMsg.match(/^Guild Name: (.+)/)) {
        onlineMessage = true;
    }
    if (onlineMessage == true) {
        onlineArray.push(jsonMsg.replaceAll('●', ' '));
        for (let i in onlineArray) {
          if (onlineArray[i].match(/^Offline Members: \d+/)) {
            onlineMessage = false;
            for (let arrayLine in onlineArray) {
              let line = onlineArray[arrayLine];
              for (let message in boldMessages) {
                if (line.includes(boldMessages[message])) {
                  onlineArray[arrayLine] = '**' + onlineArray[arrayLine] + '**';
                }
              }
              for (let character in line) {
                if (line[character] == '-') {
                  onlineArray[arrayLine] = '**' + onlineArray[arrayLine] + '**';
                  break;
                }
              }
              onlineArray[arrayLine] = onlineArray[arrayLine].replaceAll('_', '\\_');
              if (line.split('')[2] == '-') line = '**' + line + '**'
            }
            const embed = new MessageEmbed()
            .setTitle('Online Members')
            .setDescription(onlineArray.join('\n'))
            .setColor('#00ff00')
            const players = [];
            let guildName = "";
            let totalMembers = 0;
            let onlinePlayers = 0;
            for (const line of onlineArray) {
              if (line.startsWith('**')) {
                switch (line.split(' ')[0]) {
                  case "**Guild": //guild name
                    guildName = line.split(': ')[1].replaceAll('*', '');
                    break;
                  case "**Total": //total members
                    totalMembers = line.split(' ')[2].replaceAll('*', '');
                    break;
                  case "**Online": //online members
                    onlinePlayers = line.split(' ')[2].replaceAll('*', '');
                    break;
                }
              }
              else {
                const playerArr = line.match(/(?:\[\S+\] )(\S+)/g) || line.match(/\S+/g);
                for (const player of playerArr) {
                  const playerSplit = player.replaceAll('\\', '').split(' ');
                  const pushed = playerSplit[1] ? playerSplit[1] : playerSplit[0];
                  players.push(pushed);
                }
              }
            }
            global.onlineEmbed = {
              embed: embed,
              content: onlineArray.join('\n'),
              players: players,
              name: guildName,
              total: totalMembers,
              online: onlinePlayers
            }
            setTimeout(() => {
              delete global.onlineEmbed;
            }, 30 * 1000);
            onlineArray = [];
          }
        }
    } 
}