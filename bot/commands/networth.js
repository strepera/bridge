import skyhelper from 'skyhelper-networth'
import { apiKey } from '../config.js';

async function getNetworth(bot, requestedPlayer) {
  let uuid;
  try {
  const response1 = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
  const json1 = await response1.json();
  uuid = json1.id;
  requestedPlayer = json1.name;
  const response2 = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${apiKey}&uuid=${uuid}`);
  const json2 = await response2.json();
  if (json2.success === true && json2.profiles !== null) {
    let selectedProfileId;
    let profileData;
    let bankBalance;
    for (let profile of json2.profiles) {
      if (profile.selected === true) {
        selectedProfileId = profile.profile_id;
        profileData = profile.members[uuid];
        bankBalance = profile.banking?.balance;
        break;
      }
    }
    if (selectedProfileId === undefined) {return}
    const museumResponse = await fetch(`https://api.hypixel.net/v2/skyblock/museum?key=${apiKey}&uuid=${uuid}&profile=${selectedProfileId}`);
    const museumData = await museumResponse.json();
    const networth = await skyhelper.getNetworth(profileData, bankBalance, { v2Endpoint: true, onlyNetworth: true, museumData });
    let num = parseInt(networth.networth.toLocaleString().replace(/,/g, ""));
    let shortenedNetworth = `${Math.round(networth.networth.toLocaleString())} (${formatNumber(num)})`;
    let lengthenedNetworth = Math.round(networth.networth).toLocaleString();
    lengthenedNetworth = lengthenedNetworth.replaceAll(",", " ");
    bot.chat(`/gc ${requestedPlayer}'s networth is ${lengthenedNetworth}${shortenedNetworth.replaceAll('NaN', '')}.`);
    global.lastMessage = (`/gc ${requestedPlayer}'s networth is ${lengthenedNetworth}${shortenedNetworth.replaceAll('NaN', '')}.`);
  }
  else {
    bot.chat("/gc Invalid user " + requestedPlayer);
    global.lastMessage = ("/gc Invalid user " + requestedPlayer);
    console.error("Invalid user");
  }
  } catch (error) {
  console.error('Error:', error);
  }
}

export default async function(bot, requestedPlayer) {
  requestedPlayer = requestedPlayer.split(" ")[0];
  requestedPlayer = requestedPlayer.replaceAll("\\", "");
  if (requestedPlayer.includes("/")) {
    let requestedPlayers = requestedPlayer.split("/");
    for (let requestedPlayer in requestedPlayers) {
      requestedPlayer = requestedPlayers[requestedPlayer];
      getNetworth(bot, requestedPlayer);
    }
  }
  else {
    getNetworth(bot, requestedPlayer);
  }
}