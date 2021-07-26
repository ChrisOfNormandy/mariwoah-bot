const Discord = require('discord.js');
const MessageData = require('./MessageData');

class Command {
    /**
     * 
     * @returns {string}
     */
    getGroup() {
        return this.group;
    }

    /**
     * 
     * @returns {{command: RegExp, arguments: RegExp, argumentIndexes: number[], argsOptional: boolean}}
     */
    getRegex() {
        return this.regex;
    }

    /**
     * 
     * @param {RegExp} command 
     * @param {RegExp} args 
     * @param {number[]} indexes 
     * @param {boolean} optional 
     * @returns {Command}
     */
    setRegex(command, args = null, indexes = [], optional = false) {
        this.regex = {
            command: command,
            arguments: args,
            argumentIndexes: indexes,
            argsOptional: optional
        };

        this.description = {
            command: "",
            arguments: []
        };

        return this;
    }

    /**
     * 
     * @returns {{command: string, arguments: {_: string, d: string, optional: boolean}[]}}
     */
    getDescription() {
        return this.description;
    }

    /**
     * 
     * @param {string} desc 
     * @returns {Command}
     */
    setCommandDescription(desc) {
        this.description.command = desc;
        return this;
    }

    /**
     * 
     * @param {number} index 
     * @param {string} name 
     * @param {string} desc 
     * @param {boolean} optional 
     * @returns {Command}
     */
    setArgumentDescription(index, name, desc, optional = false) {
        this.description.arguments[index] = {
            _: name,
            d: desc,
            optional
        };
        return this;
    }

    /**
     * 
     * @param {Discord.Message} message 
     * @param {MessageData} data 
     * @returns 
     */
    run(message, data) {
        return this.func(message, data);
    }

    /**
     * 
     * @param {string} key 
     * @param {*} value 
     * @returns {Command}
     */
    setSetting(key, value) {
        this.settings.set(key, value);
        return this;
    }

    /**
     * 
     * @param {string} key 
     * @returns {*}
     */
    getSetting(key) {
        return this.settings.get(key);
    }

    /**
     * 
     * @returns {Command}
     */
    disable() {
        this.enabled = false;
        return this;
    }

    /**
     * 
     * @returns {Command}
     */
    setAdminOnly() {
        this.adminOnly = true;
        return this;
    }

    /**
     * 
     * @param  {Command} command 
     * @returns {Command}
     */
    addSubcommand(name, command) {
        this.subcommands.set(name, command.setName(name));
        return this;
    }

    /**
     * 
     * @param {string} name 
     * @returns {Command}
     */
    getSubcommand(name) {
        return this.subcommands.get(name);
    }

    /**
     * 
     * @param {string} name 
     * @returns {Command}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * 
     * @param {function(Discord.Message, MessageData)} func
     * @returns {Command}
     */
    setFunction(func) {
        this.func = func;
        return this;
    }

    /**
     * 
     * @param {string} flag 
     * @param {string} value 
     * @returns {Command}
     */
    setFlag(flag, value) {
        this.flags.set(flag, value);
        return this;
    }

    /**
     * 
     * @param {string} flag 
     * @returns {string}
     */
    getFlag(flag) {
        return this.flags.get(flag);
    }

    /**
     * 
     * @param {string} group 
     * @param {function(Discord.Message, MessageData)} func
     */
    constructor(group = undefined, func = () => {}) {
        /**
         * @type {string}
         */
        this.group = group;
        /**
         * @type {function(Discord.Message, MessageData)}
         */
        this.func = func;

        /**
         * @type {string}
         */
        this.name = undefined;
        this.regex = {
            command: undefined,
            arguments: undefined,
            argumentIndexes: undefined,
            argsOptional: undefined
        };
        this.description = {
            command: undefined,
            arguments: undefined
        };
        
        /**
         * @type {Map<string, Command>}
         */
        this.subcommands = new Map();

        this.adminOnly = false;
        this.enabled = true;

        /**
         * @type {Map<string, *>}
         */
        this.settings = new Map();

        /**
         * @type {Map<string, *>}
         */
        this.flags = new Map();
    }
}

module.exports = Command;