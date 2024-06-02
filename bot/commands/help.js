export default function help(bot, request, player) {
  async function chat(message) {
    bot.chat(message);
    bot.lastMessage = (message);
  }

  const messages = {
    "image": () => chat("/gc https://imgur.com/sTaVP3Z"),
    "8ball": () => chat("/gc Usage .8ball {question} | e.g. .8ball am i cool?"),
    "bingo": () => chat("/gc Usage .bingo {player} | Shows player's bingo information"),
    "cata": () => chat("/gc Usage Use .cata 1 for cata info help, use .cata 2 for cata calc help."),
    "cata 1": () => chat("/gc Usage .cata {player} | e.g. .cata snailify"),
    "cata 2": () => chat("/gc Usage .cata {player} calc {level} {floor} {hecatomb/ring} | e.g. .cata snailify calc 50 m7 hecatomb ring"),
    "cf": () => chat("/gc Usage .cf {player} | Shows cf info for player"),
    "class": () => chat("/gc Usage .class {player} | e.g. .class snailify"),
    "coinflip": () => chat("/gc Usage .coinflip {amount} {heads/tails} | e.g. .coinflip 100 tails"),
    "contest": () => chat("/gc Usage .contest | Output | The next contest is {crop}, {crop}, {crop}. It will start in {minutes} minutes."),
    "dice": () => chat("/gc Usage .dice {amount} | e.g. .dice 100"),
    "discord": () => chat("/gc Usage .discord | Output | The discord link is https://discord.com/invite/VeB4Z9C"),
    "pay": () => chat("/gc Usage .pay {player} {amount} | e.g. .pay snailify 1000"),
    "event": () => chat("/gc Usage .event {jerry/spooky} | e.g. .event jerry"),
    "fetchur": () => chat("/gc Usage .fetchur | Fetchur's item"),
    "firesale": () => chat("/gc Usage .firesale | Shows info about the current firesale"),
    "fish": () => chat("/gc Usage .fish | Gives random amount of coins"),
    "fps": () => chat("/gc Usage .fps | Output | https://www.youtube.com/watch?v=io4wESYYBwk&t=7s"),
    "gexp": () => chat("/gc Usage .gexp {player} | e.g. .gexp snailify"),
    "guild": () => chat("/gc Usage .guild {player/guild} | e.g. .guild Nope Ropes"),
    "harp": () => chat("/gc Usage .harp {player} | Shows harp info for player"),
    "hotm": () => chat("/gc Usage .hotm {player} | Shows mining and hotm info for player"),
    "info": () => chat("/gc Usage .info {player} | e.g. .info snailify"),
    "jacob": () => chat("/gc Usage .jacob {player} | e.g. .jacob snailify"),
    "joke": () => chat("/gc Usage .joke | Output | (random setup then punchline)"),
    "leaderboard": () => chat("/gc Usage .lb {player in guild} {leaderboard type} | Types | gexp, nw, level"),
    "math": () => chat("/gc Usage .math {question} | e.g. .math 5 x 6"),
    "mayor": () => chat("/gc Usage .mayor | Output | Current mayor and next mayor with perks"),
    "mp": () => chat("/gc Usage .mp {player} | e.g. .mp snailify"),
    "networth": () => chat("/gc Usage .networth {player} | e.g. .networth snailify"),
    "online": () => chat("/gc Usage .online {player} or .online | Output | {player} is in SKYBLOCK - {island} or the people online in the other guild."),
    "patchnotes": () => chat("/gc Usage .patchnotes | Output | (most recent patchnotes)"),
    "players": () => chat("/gc Usage .players | Output | (amount of players in each skyblock island)"),
    "profile": () => chat("/gc Usage .profile {player} {profile} | e.g. .profile snailify peach"),
    "random": () => chat("/gc Usage .random {number 1-15} | Output | (that many guild users)"),
    "skills": () => chat("/gc Usage .skills {player} {profile} | e.g. .skills snailify peach"),
    "slayer": () => chat("/gc Usage .slayer {player} {profile} | e.g. .slayer snailify peach"),
    "speeds": () => chat("/gc Usage .speeds {crop} | e.g. | .speeds wart"),
    "uuid": () => chat("/gc Usage .uuid {player} | Output | {player}'s uuid is {uuid}"),
    "wiki": () => chat("/gc Usage .wiki {item/npc/location/anything} | e.g. .wiki plasmaflux power orb")
  }
  if (request == player) {
    chat('Prefix "." | Commands | 8ball bingo cata cf class coinflip contest dice discord pay event fetchur firesale fish fps gexp guild harp hotm help info jacob joke leaderboard math mayor mp networth online patchnotes players profile random skills slayer speeds uuid wiki')
  }
  else if (messages[request]) {
    messages[request]();
  }
  else {
    chat('Invalid usage of .help, use without arguments to view all commands.');
  }
}