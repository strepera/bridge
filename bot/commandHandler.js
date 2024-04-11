async function importCommand(commandName) {
    try {
        const commandModule = await
        import (`./commands/${commandName}.js`);
        return commandModule.default || commandModule;
    } catch (error) {
        console.error(`Failed to import command ${commandName}:`, error);
        return null;
    }
}

export default async function commands(bot, jsonMsg, match) {
if (match = jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?(\w+) \[(\w+)\]: \.(\w+)( .*)?/)) {
    let command = match[4];
    let requestedPlayer = match[5] || match[2];
    if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
    if (command.includes('/')) {
        const commandSplit = command.split('/');
        for (i in commandSplit) {
            const executed = command == 'nw' ? await importCommand('networth') : await importCommand(i);
            if (executed) executed(bot, requestedPlayer);
        }
    } else {
        const executed = command == 'nw' ? await importCommand('networth') : await importCommand(command);
        if (executed) executed(bot, requestedPlayer);
    }
} else if (match = jsonMsg.match(/Guild > (?:\[(\w+\+?)\] )?(\w+) \[(\w+)\]: (.+): \.(\w+)( .*)?/)) {
    let command = match[5];
    let requestedPlayer = match[6] || match[4];
    if (requestedPlayer.split('')[0] == ' ') requestedPlayer = requestedPlayer.substring(1);
    if (command.includes('/')) {
        const commandSplit = command.split('/');
        for (i in commandSplit) {
            const executed = command == 'nw' ? await importCommand('networth') : await importCommand(i);
            if (executed) executed(bot, requestedPlayer);
        }
    } else {
        const executed = command == 'nw' ? await importCommand('networth') : await importCommand(command);
        if (executed) executed(bot, requestedPlayer);
    }
}
}
