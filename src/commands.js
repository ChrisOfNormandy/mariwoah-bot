const Command = require('./app/objects/Command');

const groups = require('./app/groups');
const help = require('./app/help');

/**
 * 
 * @returns {Command[]}
 */
function getList() {
    let list = [];
    Array.from(groups.cache.values()).forEach(group => {
        group.getCommands().forEach(command => list.push(command));
    });

    list.push(
        new Command(
            'general',
            (message, data) => help(data, list)
        )
            .setRegex(/(\?)|(help)/, /\s([\w\?]+)/, [1], true)
            .setCommandDescription('Displays a list of commands and syntaxes.')
            .setArgumentDescription(0, 'Command', 'A command string.', true)
            .setSetting('responseClear', { delay: 30 })
            .setSetting('commandClear', { delay: 0 })
    );

    console.log(list);

    return list;
}


module.exports = {
    getList
};