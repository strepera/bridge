async function importCommand(commandName) {
    try {
        const commandModule = await
        import (`./commands/${commandName}.js`);
        return commandModule.default || commandModule;
    } catch (error) {
        console.error(error);
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

function generateRandomNonNumericString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

const guildDisabled = ["ai", "bedtime", "coinflip"];

export default async function commands(bot, branch, jsonMsg) {
    let match;
    if (match = jsonMsg.match(/^Guild > (?:\[(\S+)\] )?(\S+) \[(\S+)\]: \.(\S+)( .*)?/)) {
        let command = match[4];
        if (guildDisabled.includes(command)) return;
        let requestedPlayer = match[5] || match[2];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            const response = await executed(bot, requestedPlayer, match[2], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
            branch.lastCommand = command + ' ' + requestedPlayer;
            if (response) {
                bot.chat(response + ' #' + generateRandomNonNumericString(8));
                bot.lastMessage = response + ' #' + generateRandomNonNumericString(8);
                setTimeout(() => {
                    branch.chat(response + ' #' + generateRandomNonNumericString(8));
                    branch.lastMessage = response + ' #' + generateRandomNonNumericString(8);
                }, 500);
            }
        }
    } else if (match = jsonMsg.match(new RegExp("^Guild > (?:\\[(\\S+)\\] )?" + process.env.botUsername1 + " \\[(\\S+)\\]: (\\S+) \\S \\.(\\S+)( .*)?"))) {
        let command = match[4];
        if (guildDisabled.includes(command)) return;
        let requestedPlayer = match[5] || match[3];
        if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) {
            const response = await executed(bot, requestedPlayer, match[3], '/gc ');
            bot.lastCommand = command + ' ' + requestedPlayer;
            branch.lastCommand = command + ' ' + requestedPlayer;
            if (response) {
                bot.chat(response + ' #' + generateRandomNonNumericString(8));
                bot.lastMessage = response + ' #' + generateRandomNonNumericString(8);
                setTimeout(() => {
                    branch.chat(response + ' #' + generateRandomNonNumericString(8));
                    branch.lastMessage = response + ' #' + generateRandomNonNumericString(8);
                }, 500);
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