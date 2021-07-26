const Command = require('../../objects/Command');
const Output = require('../../objects/Output');
const groups = require('../../groups');

const list = [
    new Command(
        'about',
        (message, data) => groups.factions.about(message, data)
    )
        .setRegex(/about/, /\s(\w+)/, [1])
        .setCommandDescription('Gathers information about a faction, such as its leader and members.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.'),
    new Command(
        'create',
        (message, data) => groups.factions.create(message, data)
    )
        .setRegex(/create/, /\s(\w+)/, [1])
        .setCommandDescription('Creates a new faction.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.'),
    new Command(
        'list',
        (message, data) => groups.factions.list(message, data)
    )
        .setRegex(/list/)
        .setCommandDescription('List all factions in the server.'),
    new Command(
        'remove',
        (message, data) => groups.factions.remove(message, data)
    )
        .setRegex(/remove/, /\s(\w+)/, [1])
        .setCommandDescription('Deletes a faction from the server.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.'),
    new Command(
        'setcolor',
        (message, data) => groups.factions.setColor(message, data)
    )
        .setRegex(/setcolor/, /\s(\w+)\s(#[0-9a-f]{6})/, [1, 2])
        .setCommandDescription('Sets the faction color, seen in its `about` page.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.')
        .setArgumentDescription(1, 'Color', 'A hex color value.'),
    new Command(
        'seticon',
        (message, data) => groups.factions.setIcon(message, data)
    )
        .setRegex(/seticon/, /\s(\w+)\s(<URL:0>)/, [1, 2])
        .setCommandDescription('Sets the faction icon, seen in its `about` page.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.')
        .setArgumentDescription(1, 'Image', 'An image URL for an icon.'),
    new Command(
        'delete',
        (message, data) => groups.factions.delete(message, data)
    )
        .setRegex(/delete/, /\s(\w+)/, [1])
        .setCommandDescription('Deletes a faction.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.'),
    new Command(
        'reset',
        (message, data) => groups.factions.reset(message, data)
    )
        .setRegex(/reset/, /\s(\w+)/, [1])
        .setCommandDescription('Reset a faction.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.'),
    new Command(
        'join',
        (message, data) => groups.factions.members.join(message, data)
    )
        .setRegex(/join/, /\s(\w+)/, [1])
        .setCommandDescription('Join a faction.')
        .setArgumentDescription(0, 'Name', 'The name of a faction'),
    new Command(
        'leave',
        (message, data) => groups.factions.members.leave(message, data)
    )
        .setRegex(/leave/, /\s(\w+)/, [1])
        .setCommandDescription('Leave a faction.')
        .setArgumentDescription(0, 'Name', 'The name of a faction.')
];

let factionCommand = new Command('factions');
factionCommand.setFunction((message, data) => {
    let sc = factionCommand.getSubcommand(data.subcommand);
    return !!sc
        ? sc.run(message, data)
        : Promise.reject(new Output().setError(new Error('Subcommand not found.')));
})
    .setRegex(/(faction)|(fc)/)
    .setCommandDescription('Faction commands.');
list.forEach(cmd => factionCommand.addSubcommand(cmd.getGroup(), cmd));

/**
 * @type {Command[]}
 */
module.exports = [
    factionCommand
];