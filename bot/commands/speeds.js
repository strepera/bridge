export default function speeds(bot, requestedCategory) {
  let message;
  const aliases = {
    "crops": ["crops", "nether wart", "wart", "carrot", "potato", "wheat"],
    "sugarcane": ["cane", "sugar cane"],
    "cocoa": ["cocoa", "bean", "beans", "cocoa bean", "cocoa beans"],
    "cactus": ["cactus"],
    "mushroom": ["mushroom", "shroom"],
    "melon": ["melon"],
    "pumpkin": ["pumpkin"]
  };

  const category = Object.keys(aliases).find(key => aliases[key].includes(requestedCategory.toLowerCase()));

  switch (category) {
    case "crops":
      message = "/gc " + requestedCategory + " (✦93) (⇄90/180) (⇅0/3)";
      break;
    case "sugarcane":
      message = "/gc Sugar Cane (✦328) (⇄135/45) (⇅0)";
      break;
    case "cocoa":
      message = "/gc Cocoa Beans (✦155 ✖Sprint) (⇄90/180) (⇅45)";
      break;
    case "cactus":
      message = "/gc Cactus (✦478) (⇄90/180) (⇅0)";
      break;
    case "mushroom":
      message = "/gc Sugar Cane (✦233) (⇄120/60) (⇅0)";
      break;
    case "melon":
      message = "/gc Melon (✦290) (⇄90/180) (⇅58/-58)";
      break;
    case "pumpkin":
      message = "/gc Pumpkin (✦290) (⇄90/180) (⇅58/-58)";
      break;
    default:
      message = "/gc Invalid category. Use .speeds {crops/cane/cocoa/cactus/mushroom/melon/pumpkin}.";
      break;
  }
  bot.chat(message);
  global.lastMessage = message;
}
