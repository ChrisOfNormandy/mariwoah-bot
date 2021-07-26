const Command = require('../../objects/Command');
const groups = require('../../groups');

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'fetch',
        (message, data) => groups.fetch.findImg(data)
    )
        .setRegex(/(findimg)|(img)/, /\s(.+)/, [1])
        .setCommandDescription('Searches for an image.')
        .setArgumentDescription(0, 'Query', 'A provided search term.')
        .setFlag('r', 'Return a random image instead of the first result.')
        .setFlag('N', 'Allows NSFW results; defaults to moderate only.'),
    new Command(
        'fetch',
        (message, data) => groups.fetch.find(data)
    )
        .setRegex(/(find)|(search)/, /\s(.+)/, [1])
        .setCommandDescription('Fetches resuts for a search query.')
        .setArgumentDescription(0, 'Query', 'A provided search term.')
        .setFlag('r', 'Return a random image instead of the first result.')
        .setFlag('N', 'Allows NSFW results; defaults to moderate only.')
];