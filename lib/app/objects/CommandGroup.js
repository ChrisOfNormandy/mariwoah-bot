"use strict";
class CommandGroup {
    /**
     *
     * @param {Command} command
     * @returns {CommandGroup}
     */
    addCommand(command) {
        this.collection.push(command);
        return this;
    }
    /**
     *
     * @returns {Command[]}
     */
    getCommands() {
        return this.collection;
    }
    constructor(name) {
        this.name = name;
        /**
         * @type {Command[]}
         */
        this.collection = [];
    }
}
module.exports = CommandGroup;
