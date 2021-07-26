const Command = require('./app/objects/Command');

const groups = require('./app/groups');

const factions = require('./app/groups/factions/commands');
const fetch = require('./app/groups/fetch/commands');
const games = require('./app/groups/games/commands');
const general = require('./app/groups/general/commands');
const misc = require('./app/groups/misc/commands'); // Has subgroups
const music = require('./app/groups/music/commands');
const utility = require('./app/groups/utility/commands');

/**
 * 
 * @returns {Command[]}
 */
function getList() {
    return [].concat(
        factions,
        fetch,
        games,
        general,
        misc.crypto,
        music,
        utility
    );
}

const list = getList();
list.push(
    new Command(
        'general',
        (message, data) => groups.general.help(message, data, list)
    )
        .setRegex(/(\?)|(help)/, /\s([\w\?]+)/, [1])
        .setCommandDescription('Displays a list of commands and syntaxes.')
        .setArgumentDescription(0, 'Command', 'A command string.', true)
        .setSetting('responseClear', { delay: 30 })
        .setSetting('commandClear', { delay: 0 })
);

console.log(`Loaded ${list.length} commands.`);

module.exports = list;