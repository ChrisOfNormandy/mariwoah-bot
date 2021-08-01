const Command = require('./objects/Command');

const groups = require('./groups');
const help = require('./help');

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

    return list;
}


const _ = {
    /**
     * @type {Command[]}
     */
    cache: [],

    /**
     * 
     * @returns {Command[]}
     */
    getList: () => {
        return _.cache.length ? _.cache : getList();
    }
};

module.exports = _;