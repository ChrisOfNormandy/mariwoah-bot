const groups = require('../../groups');

const { Command } = require('@chrisofnormandy/mariwoah-bot');

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'fetch',
        'find-image',
        groups.fetch.findImg
    )
        .setRegex(/(findimg\b)|(img\b)/, /\s(.+)/, [1])
        .setCommandDescription('Searches for an image.')
        .setArgumentDescription(0, 'Query', 'A provided search term.')
        .setFlag('r', 'Return a random image instead of the first result.')
        .setFlag('N', 'Allows NSFW results; defaults to moderate only.'),

    new Command(
        'fetch',
        'find',
        groups.fetch.find
    )
        .setRegex(/(find\b)|(search\b)/, /\s(.+)/, [1])
        .setCommandDescription('Fetches resuts for a search query.')
        .setArgumentDescription(0, 'Query', 'A provided search term.')
        .setFlag('r', 'Return a random image instead of the first result.')
        .setFlag('N', 'Allows NSFW results; defaults to moderate only.')
];