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
    'dono': 'donate',
    'pay': 'donate',
    'stocks': 'stock',
    'lb': 'leaderboard',
    'skill': 'skills',
    'rep': 'reputation',
    'lbin': 'lowestbin'
};

export default async function commands(bot, branch, jsonMsg) {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: \.(\S+)( .*)?/)) {
        let command = match[4];
        let requestedPlayer = match[5] || match[2];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            const response = await executed(bot, requestedPlayer, match[2], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
            branch.lastCommand = command + ' ' + requestedPlayer;
            if (response) {
                bot.chat(response);
                bot.lastMessage = response;
                branch.chat(response);
                branch.lastMessage = response;
            }
        }
    } else if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + process.env.botUsername1 + " \\[(\\S+)\\]: (\\S+) \\S \\.(\\S+)( .*)?"))) {
        let command = match[4];
        let requestedPlayer = match[5] || match[3];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            const response = await executed(bot, requestedPlayer, match[3], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
            branch.lastCommand = command + ' ' + requestedPlayer;
            if (response) {
                bot.chat(response);
                bot.lastMessage = response;
                branch.chat(response);
                branch.lastMessage = response;
            }
        }
    }
    if (match = jsonMsg.match(/^Party > (?:\[(\S+)\] )?(\S+): \.(\S+)( .*)?/)) {
        let command = match[3];
        let requestedPlayer = match[4] || match[2];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            const response = await executed(bot, requestedPlayer, match[2], '/pc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
            branch.lastCommand = command + ' ' + requestedPlayer;
            if (response) {
                bot.chat(response);
                bot.lastMessage = response;
            }
        }
    }
}