const groups = require('./app/groups');

const factions = require('./app/groups/factions/commands');
const fetch = require('./app/groups/fetch/commands');
const games = require('./app/groups/games/commands');
const general = require('./app/groups/general/commands');
const misc = require('./app/groups/misc/commands'); // Has subgroups
const music = require('./app/groups/music/commands');
const utility = require('./app/groups/utility/commands');

function getList() {
    let arr = [];
    return arr.concat(
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

list.push({
    group: 'general',
    regex: {
        command: /(\?)|(help)/,
        arguments: /\s?([\w\?]+)?/,
        argumentIndexes: [1]
    },
    description: {
        command: "Displays a list of commands and syntaxes.",
        arguments: [
            {
                _: "Command",
                d: "A command string.",
                optional: true
            }
        ]
    },
    adminOnly: false,
    settings: {
        "responseClear": {
            delay: 30
        },
        "commandClear": {
            delay: 0
        }
    },
    enabled: true,
    run: (message, data) => groups.general.help(message, data, list)
});

console.log(`Loaded ${list.length} commands.`);

module.exports = list;