const Command = require('../../objects/Command');
const groups = require('../../groups');

/**
 * @type {Command[]}
 */
module.exports = [
    new Command(
        'general',
        (message, data) => groups.general.ping(message)
    )
        .setRegex(/(ping)/)
        .setCommandDescription(`Gauge Discord's message latency.`)
        .setSetting('commandClear', { delay: 0 }),
    new Command(
        'general',
        (message, data) => groups.general.whois.self(message)
    )
        .setRegex(/(whoami)|(me)/)
        .setCommandDescription('Gathers and displays information about yourself.')
        .setSetting('commandClear', { delay: 0 })
        .setSetting('responseClear', { delay: 30 }),
    new Command(
        'general',
        (message, data) => groups.general.whois.member(message)
    )
        .setRegex(/(whoareyou)|(whoru)|(whois)/, /\s(<USER:\d+>)/, [1])
        .setCommandDescription('Gathers and displays information about another user.')
        .setArgumentDescription(0, '@User', 'A pinged user.')
        .setSetting('commandClear', { delay: 0 })
        .setSetting('responseClear', { delay: 30 })
];
