import { MessageEmbed } from "discord.js";
import getGist from '../getGist.js'

export async function func(interaction) {
    try {
        let users = await getGist()
        users = users.filter(user => user.dcuser !== interaction.user.username);
        await getGist(JSON.stringify(users, null, 2));
        interaction.reply({embeds: [unverifiedEmbed]});
        interaction.member.roles.cache.forEach(async(role) => {
        if (givenRoles.includes(role.name)) {
            try {
                await interaction.member.roles.remove(role);
            }
            catch(e) {
                console.error(interaction.user.username + ' has elevated permissions. Cannot delete role.');
            }
        }
        });
    } catch (e) {
      console.error(e);
    }
}

export const data = {
    name: "unverify",
    description: "Unlinks your minecraft and discord accounts",
}

const givenRoles = [
  'Nope Ropes',
  'Danger Noodles',
  'VIP',
  'VIP+',
  'MVP',
  'MVP+',
  'Verified',
  'Member',
  'Danger Noodle',
  'Elite',
  'Ironman'
]
  
const unverifiedEmbed = new MessageEmbed()
  .setColor('#1EA863')
  .setTitle('Success')
  .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
  .setDescription('Successfully unverified and removed your roles.')