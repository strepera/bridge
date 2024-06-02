const items = [
    "20x Yellow Stained Glass",
    "1x Compass",
    "20x Mithril",
    "1x Firework Rocket",
    "1x Cheap Coffee, Decent Coffee, or Black Coffee",
    "1x Iron Door or Wood Door",
    "3x Rabbit's Foot",
    "1x Superboom TNT",
    "1x Pumpkin",
    "1x Flint and Steel",
    "50x Emerald",
    "50x Red Wool"
];

export default async function(bot, requestedPlayer, player, chat) {
    function msg(message) {
        bot.chat(chat + message);
        bot.lastMessage = chat + message;
    }

    function getCurrentTimeInEst() {
        const now = new Date();
        const utcOffset = -5;
        return new Date(now.getTime() + (utcOffset * 60 * 60 * 1000));
    }

    function calculateCycleIndex(time) {
        const hoursSinceMidnight = Math.floor((time.getHours() % 24) / 24);
        return hoursSinceMidnight;
    }

    const currentTimeInEst = getCurrentTimeInEst();

    const cycleIndex = calculateCycleIndex(currentTimeInEst);

    const currentIndex = cycleIndex % items.length;

    const currentItem = items[currentIndex + 1];

    msg(`Fetchur currently wants ${currentItem}.`);
}