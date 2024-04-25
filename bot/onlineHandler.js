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
            global.onlineEmbed = new MessageEmbed()
            .setTitle('Online Members')
            .setDescription(onlineArray.join('\n'))
            .setColor('#00ff00')
            setTimeout(() => {
              delete global.onlineEmbed;
            }, 30 * 1000);
            onlineArray = [];
          }
        }
    } 
}