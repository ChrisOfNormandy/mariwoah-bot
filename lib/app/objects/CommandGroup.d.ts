export = CommandGroup;
declare class CommandGroup {
    constructor(name: any);
    /**
     *
     * @param {Command} command
     * @returns {CommandGroup}
     */
    addCommand(command: Command): CommandGroup;
    /**
     *
     * @returns {Command[]}
     */
    getCommands(): Command[];
    name: any;
    /**
     * @type {Command[]}
     */
    collection: Command[];
}
