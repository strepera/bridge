async function importCommand(commandName) {
    try {
        const commandModule = await
        import (`./commands/${commandName}.js`);
        return commandModule.default || commandModule;
    } catch (error) {
        console.error(`Invalid command: ${commandName}`);
        return null;
    }
}

async function getCommandAliases(command) {
    try {
        for (let alias in aliases) {
            if (alias == command) {
                const executed = await importCommand(aliases[alias]);
                if (executed) return executed;
            }
        }
        return null;
    }
    catch(e) {
        console.error(e);
    }
}

const aliases = {
    'nw': 'networth',
    'speed': 'speeds',
    'spd': 'speeds',
    'plrs': 'players',
    'i': 'info',
    'd': 'dice',
    'cf': 'coinflip',
    'dono': 'donate',
    'pay': 'donate',
    'stocks': 'stock',
    'lb': 'leaderboard'
};

export default async function commands(bot, jsonMsg, botUsername) {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: \.(\S+)( .*)?/)) {
        let command = match[4];
        let requestedPlayer = match[5] || match[2];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            executed(bot, requestedPlayer, match[2], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
        }
    } else if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + botUsername + " \\[(\\S+)\\]: (\\S+) \\S \\.(\\S+)( .*)?"))) {
        let command = match[4];
        let requestedPlayer = match[5] || match[3];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            executed(bot, requestedPlayer, match[3], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
        }
    }
    if (match = jsonMsg.match(/^Party > (?:\[(\S+)\] )?(\S+): \.(\S+)( .*)?/)) {
        let command = match[3];
        let requestedPlayer = match[4] || match[2];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            executed(bot, requestedPlayer, match[2], '/pc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
        }
    }
}