const { Command } = require('@chrisofnormandy/mariwoah-bot');

const groups = require('../../groups');

function shuffle(message, data) {
    return new Promise((resolve, reject) => {
        require('./app/helpers/shuffle')(data.arguments[0].split(/,\s*/))
            .then(arr => resolve({ values: arr, content: [arr.join(', ')] }))
            .catch(e => reject({ rejections: [e], content: [] }));
    });
}

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'utility',
        (message, data) => groups.utility.clean(message, data)
    )
        .setRegex(/(clean)/, /\s(\d+)/, [1], true)
        .setCommandDescription('Cleans chat of bot messages and commands. Can be used to clean specific user messages.')
        .setArgumentDescription(0, 'Message count', 'How many messages to delete. Max 50 total.', true),
    new Command(
        'utility',
        (message, data) => groups.utility.roll(data)
    )
        .setRegex(/(roll)|(r)|(d)/, /\s?(\d+)?(\s(\d+))?/, [1, 3])
        .setCommandDescription('Rolls a number between 1 and a given value.')
        .setArgumentDescription(0, 'Sides', 'Any integer between 1 and 2^53-1. Defaults to 6.', true)
        .setArgumentDescription(1, 'Count', 'Any integer between 1 and 50', true),
    new Command(
        'utility',
        (message, data) => shuffle(message, data)
    )
        .setRegex(/(shuffle)/, /\s((([^",\s]+)|("([^"\\]*(?:\\[^,][^"\\]*)*)"))(,\s?)?)+/, [0])
        .setCommandDescription('Shuffles a set of comma-separated values.')
        .setArgumentDescription(0, 'List', 'A list of comma-separated values.'),
    new Command(
        'utility',
        (message, data) => groups.utility.colorMe(message, data)
    )
        .setRegex(/(colorme)|(clrme)/, /\s(.+)/, [1])
        .setCommandDescription('Assigns a user a colored role.')
        .setArgumentDescription(0, 'Color', 'Any standard color.'),
    new Command(
        'utility',
        (message, data) => groups.utility.chatFilter_get(message, data)
    )
        .setRegex(/(getchatfilter)|(cfget)/, /\s(\w+)/, [1])
        .setCommandDescription('Fetches the server chat filter rules for a given filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.chatFilter_add(message, data)
    )
        .setRegex(/(addchatfilter)|(cfadd)/, /\s(\w+)\s(.+)/, [1, 2])
        .setCommandDescription('Adds a phrase to a specified chat filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setArgumentDescription(1, 'Filter phrase.', 'Any banned statement.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.chatFilter_clear(message, data)
    )
        .setRegex(/(clearchatfilter)|(cfclear)/, /\s(\w+)/, [1])
        .setCommandDescription('Adds a phrase to a specified chat filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.chatFilter_remove(message, data)
    )
        .setRegex(/(removechatfilter)|(cfrm)/, /\s(\w+)\s(.+)/, [1, 2])
        .setCommandDescription('Removes a phrase to a specified chat filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setArgumentDescription(1, 'Filter phrase.', 'Any banned statement.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.nameFilter_get(message, data)
    )
        .setRegex(/(getnamefilter)|(nfget)/, /\s(\w+)/, [1])
        .setCommandDescription('Fetches the server name filter rules for a given filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.nameFilter_add(message, data)
    )
        .setRegex(/(addnamefilter)|(nfadd)/, /\s(\w+)\s(.+)/, [1, 2])
        .setCommandDescription('Adds a phrase to a specified name filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setArgumentDescription(1, 'Filter phrase.', 'Any banned statement.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.nameFilter_clear(message, data)
    )
        .setRegex(/(clearnamefilter)|(nfclear)/, /\s(\w+)/, [1])
        .setCommandDescription('Adds a phrase to a specified name filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.nameFilter_remove(message, data)
    )
        .setRegex(/(removenamefilter)|(nfrm)/, /\s(\w+)\s(.+)/, [1, 2])
        .setCommandDescription('Removes a phrase to a specified name filter.')
        .setArgumentDescription(0, 'Filter rule.', 'warned | kicked | banned')
        .setArgumentDescription(1, 'Filter phrase.', 'Any banned statement.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.vcRoulette(message)
    )
        .setRegex(/(roulette)|(vcr)/)
        .setCommandDescription('Roll and 1 and get disconnected.'),
    new Command(
        'utility',
        (message, data) => groups.utility.splitVc(message, data)
    )
        .setRegex(/(splitvc)|(svc)/, /\s(.+)/, [1])
        .setCommandDescription('Splits the VC into two groups.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.roleHandler.add(message, data)
    )
        .setRegex(/(setrole)|(addrole)/, /\s(<USER:(\d+)>)\s(<ROLE:(\d+)>)(\s((\d{1,2}:){1,3}\d+))?/, [2, 4, 6])
        .setCommandDescription('Give a user a role.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.roleHandler.remove(message, data)
    )
        .setRegex(/(removerole)|(rmrole)|(delrole)/, /\s(<USER:(\d+)>)\s(<ROLE:(\d+)>)/, [2, 4])
        .setCommandDescription('Remove a user role.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.roleHandler.create(message, data)
    )
        .setRegex(/(createrole)|(newrole)/, /\s(.*)/, [1])
        .setCommandDescription('Create a new role.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.roleHandler.getTimedRoles(message, data)
    )
        .setRegex(/(gettimedroles)|(gtroles)/)
        .setCommandDescription('Get timed roles.')
        .setAdminOnly(),
    new Command(
        'utility',
        (message, data) => groups.utility.roleHandler.clearTimedRoles(message, data)
    )
        .setRegex(/(cleartimedroles)|(cleartr)/)
        .setCommandDescription('Get timed roles.')
        .setAdminOnly()
];