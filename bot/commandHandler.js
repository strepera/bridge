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
    'speed': 'speeds'
}

export default async function commands(bot, jsonMsg, match) {
if (match = jsonMsg.match(/Guild > (?:\[(.+\+?)\] )?(\w+) \[(\w+)\]: \.(\w+)( .*)?/)) {
    let command = match[4];
    let requestedPlayer = match[5] || match[2];
    if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
    if (command.includes('/')) {
        const commandSplit = command.split('/');
        for (i in commandSplit) {
            const executed = await getCommandAliases(i) || await importCommand(i);
            if (executed) executed(bot, requestedPlayer);
        }
    } else {
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) executed(bot, requestedPlayer);
    }
} else if (match = jsonMsg.match(/Guild > (?:\[(.+\+?)\] )?(\w+) \[(\w+)\]: (.+): \.(\w+)( .*)?/)) {
    let command = match[5];
    let requestedPlayer = match[6] || match[4];
    if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
    if (command.includes('/')) {
        const commandSplit = command.split('/');
        for (i in commandSplit) {
            const executed = await getCommandAliases(i) || await importCommand(i);
            if (executed) executed(bot, requestedPlayer);
        }
    } else {
        const executed = await getCommandAliases(command) || await importCommand(command);
        if (executed) executed(bot, requestedPlayer);
    }
}
}
