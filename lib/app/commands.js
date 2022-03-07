"use strict";
const Command = require('./objects/Command');
const groups = require('./groups');
const help = require('./help');
/**
 *
 * @returns {Command[]}
 */
function getList() {
    let list = [];
    list.push(new Command('general', (message, data) => help(data, list))
        .setRegex(/(\?)|(help)/, /\s([\w?]+)/, [1], true)
        .setCommandDescription('Displays a list of commands and syntaxes.')
        .setArgumentDescription(0, 'Command', 'A command string.', true)
        .setSetting('responseClear', { delay: 30 })
        .setSetting('commandClear', { delay: 0 }));
    groups.cache.forEach((group) => group.getCommands().forEach((command) => list.push(command)));
    return list;
}
const commands = {
    /**
     * @type {Command[]}
     */
    cache: [],
    /**
     *
     * @returns {Command[]}
     */
    getList: () => {
        return commands.cache.length
            ? commands.cache
            : getList();
    }
};
module.exports = commands;
