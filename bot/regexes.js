import { MessageEmbed } from "discord.js";

export async function verifyCommand(interaction, username) {
  try {
      await interaction.deferReply();
      const response = await fetch('https://api.mojang.com/users/profiles/minecraft/' + username);
      const data = await response.json();
      const uuid = data.id;
      username = data.name;

      const hypixelResponse = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + uuid);
      const hypixelData = await hypixelResponse.json();

      if (hypixelData.success == true) {
          if (hypixelData.player) {
            if (hypixelData.player.socialMedia) {
            const dcuser = interaction.user.username
              if (dcuser == hypixelData.player.socialMedia.links.DISCORD) {
                await updateGist(uuid, interaction, username);
                await interaction.member.setNickname(username).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set nickname.'));
                const role = await interaction.guild.roles.cache.find(r => r.name === 'Verified');
                await interaction.member.roles.add(role).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
                try {
                    const response0 = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=Nope%20Ropes`);
                    const data0 = await response0.json();
                    if (data0.guild && data0.guild.members) {
                       for (let member in data0.guild.members) {
                         if (data0.guild.members[member].uuid == uuid) {
                           if (data0.guild.members[member].rank != "Guild Master" && data0.guild.members[member].rank != "Bot") {
                             const role = interaction.guild.roles.cache.find(r => r.name === data0.guild.members[member].rank);
                             if (role) {
                               await interaction.member.roles.add(role).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
                             } else {
                               console.error(`Role not found for rank: ${data0.guild.members[member].rank}`);
                             }
                           }
                         }
                       }
                    } else {
                       console.error('Guild or guild members not found in API response');
                    }
                } catch (e) {
                    console.error(e);
                }
                try {
                    const response1 = await fetch('https://api.hypixel.net/v2/player?key=' + process.env.apiKey + '&uuid=' + uuid);
                    const data1 = await response1.json();
                    const rank = data1.player.newPackageRank;
                    const rankRole = await interaction.guild.roles.cache.find(r => r.name === rank.replaceAll('_PLUS', '+'));
                    await interaction.member.roles.add(rankRole).catch(() => console.error(interaction.user.username + ' has elevated permissions. Cannot set role.'));
                } catch (e) {
                    console.error(e);
                }
                return;
              } else {
                await interaction.editReply({embeds: [new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Error Linking')
                    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
                    .setDescription(`Your minecraft linked discord username did not match.\nTry this tutorial and link with \`\`${interaction.user.username}\`\`:\nhttps://www.youtube.com/watch?v=UresIQdoQHk`)]});
                  return;
              }
            } else {
                await interaction.editReply({embeds: [new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Error Linking')
                    .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
                    .setDescription(`Your minecraft linked discord username did not match.\nTry this tutorial and link with \`\`${interaction.user.username}\`\`:\nhttps://www.youtube.com/watch?v=UresIQdoQHk`)]});
                  return;
            }
          } else {
              await interaction.editReply({
                  embeds: [invalidEmbed]
              });
              return;
          }
      } else {
          await interaction.editReply({
              embeds: [invalidEmbed]
          });
          return;
      }
  } catch (e) {
      console.error(e);
  }
}

async function updateGist(uuid, interaction, username) {
    const dcuser = interaction.user.username
    const users = await getGist();
    for (let user in users) {
        if (users[user].dcuser == dcuser) {
            const embed =
            new MessageEmbed()
            .setColor('FF0000')
            .setTitle('Error')
            .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
            .setDescription('You are already verified.');
            interaction.editReply({embeds:[embed]});
            return;
        }
    }
    const guildResponse = await fetch(`https://api.hypixel.net/v2/guild?key=${process.env.apiKey}&name=${process.env.guildName.replaceAll(' ', '%20')}`);
    const guildJson = await guildResponse.json();
    if (guildJson.success == true) {
        for (let player in guildJson.guild.members) {
            if (player.uuid == uuid) {
                guild = true;
                guildRank = player.rank;
                break;
            }
        }
    }
    users.push({
      uuid: uuid,
      dcuser: dcuser,
      username: username
    })
    const updatedContent = JSON.stringify(users, null, 2);
    await getGist(updatedContent);
    await interaction.editReply({embeds: [new MessageEmbed()
        .setColor('#1EA863')
        .setTitle('Successfully linked')
        .setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
        .setDescription(`**Minecraft:** ${username} \n**Discord:** ${dcuser}\nExample: \`\`/verify ${username}\`\` in this channel to verify.`)
    ]})
}

async function getGist(patch) {
    if (!patch) {
        const response = await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${process.env.gistKey}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const gistData = await response.json();
        const users = JSON.parse(gistData.files['users.json'].content);
        return users;
    }
    else {
        await fetch(`https://api.github.com/gists/${process.env.gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${process.env.gistKey}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'users.json': {
                        content: patch
                    }
                }
            })
        });
    }
}

export const verifyCommandData = {
    name: "verify",
    description: "Links your minecraft account and discord account!",
    options: [{
        name: "username",
        type: "STRING",
        description: "username",
        required: true
    }]
}

const invalidEmbed = new MessageEmbed()
.setColor('#FF0000')
.setTitle('Invalid Username')
.setThumbnail('https://cdn.discordapp.com/avatars/1183752068490612796/f127b318f4429579fa0082e287c901fd.png?size=256?size=512')
.setDescription("Player doesn't exist or doesn't play hypixel.")
