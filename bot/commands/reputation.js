export default async function reputationCommand(bot, requestedPlayer, player, chat) {
    function msg(message) {
        bot.chat(chat + message);
        bot.lastMessage = chat + message;
    }

    requestedPlayer = requestedPlayer.split(' ')[0];
    const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${requestedPlayer}`);
    const uuidJson = await uuidResponse.json();
    const uuid = uuidJson.id;
    requestedPlayer = uuidJson.name;
    const dataResponse = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${process.env.apiKey}&uuid=${uuid}`);
    const dataJson = await dataResponse.json();
    if (!dataJson.success || !dataJson.profiles) return msg("Invalid player.");
    let profileData;
    for (const profile of dataJson.profiles) {
      if (profile.selected) profileData = profile.members[uuid];
    }

    const data = profileData.nether_island_player_data;
    const mageRep = data.mages_reputation;
    const barbRep = data.barbarians_reputation;
    const lastMatriarch = new Date(data.matriarch.last_attempt).toLocaleDateString({});
    const kuudra = Object.keys(data.kuudra_completed_tiers);
    const highestTier = kuudra[kuudra.length - 2].replaceAll('none', 'basic');

    msg(`${requestedPlayer}'s reputation: [ቾ ${mageRep.toLocaleString()}] [⚒ ${barbRep.toLocaleString()}] Last Heavy Pearls: ${lastMatriarch}, Highest: ${highestTier}`);
}