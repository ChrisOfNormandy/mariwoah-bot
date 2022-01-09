export = Command;
declare class Command {
    /**
     *
     * @param {string} group
     * @param {function(Discord.Message, MessageData)} func
     */
    constructor(group?: string, func?: (arg0: Discord.Message, arg1: MessageData) => any, ...args: any[]);
    /**
     *
     * @returns {string}
     */
    getGroup(): string;
    /**
     *
     * @returns {{command: RegExp, arguments: RegExp, argumentIndexes: number[], argsOptional: boolean}}
     */
    getRegex(): {
        command: RegExp;
        arguments: RegExp;
        argumentIndexes: number[];
        argsOptional: boolean;
    };
    /**
     *
     * @param {RegExp} command
     * @param {RegExp} args
     * @param {number[]} indexes
     * @param {boolean} optional
     * @returns {Command}
     */
    setRegex(command: RegExp, args?: RegExp, indexes?: number[], optional?: boolean, ...args: any[]): Command;
    /**
     * @type {{command: RegExp, arguments: RegExp, argumentIndexes: number[], argsOptional: boolean}}
     */
    regex: {
        command: RegExp;
        arguments: RegExp;
        argumentIndexes: number[];
        argsOptional: boolean;
    };
    /**
     * @type {{command: string, arguments: {_: string, d: string, optional: boolean}[], flags: string[]}}
     */
    description: {
        command: string;
        arguments: {
            _: string;
            d: string;
            optional: boolean;
        }[];
        flags: string[];
    };
    /**
     *
     * @returns {{command: string, arguments: {_: string, d: string, optional: boolean}[], flags: {_: string, d: string, optional: boolean}[]}}
     */
    getDescription(): {
        command: string;
        arguments: {
            _: string;
            d: string;
            optional: boolean;
        }[];
        flags: {
            _: string;
            d: string;
            optional: boolean;
        }[];
    };
    /**
     *
     * @param {string} desc
     * @returns {Command}
     */
    setCommandDescription(desc: string): Command;
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns {Command}
     */
    setArgumentDescription(index: number, name: string, desc: string, optional?: boolean): Command;
    /**
     *
     * @param {number} index
     * @param {string} name
     * @param {string} desc
     * @param {boolean} optional
     * @returns {Command}
     */
    setFlagDescription(index: number, name: string, desc: string, optional?: boolean): Command;
    /**
     *
     * @param {Discord.Message} message
     * @param {MessageData} data
     * @returns {Promise<Output>}
     */
    run(message: Discord.Message, data: MessageData): Promise<Output>;
    /**
     *
     * @param {string} key
     * @param {*} value
     * @returns {Command}
     */
    setSetting(key: string, value: any): Command;
    /**
     *
     * @param {string} key
     * @returns {*}
     */
    getSetting(key: string): any;
    /**
     *
     * @returns {Command}
     */
    disable(): Command;
    enabled: boolean;
    /**
     *
     * @returns {Command}
     */
    setAdminOnly(): Command;
    adminOnly: boolean;
    /**
     *
     * @param  {Command} command
     * @returns {Command}
     */
    addSubcommand(name: any, command: Command): Command;
    /**
     *
     * @param {string} name
     * @returns {Command}
     */
    getSubcommand(name: string): Command;
    /**
     *
     * @param {string} name
     * @returns {Command}
     */
    setName(name: string): Command;
    name: string;
    /**
     *
     * @param {function(Discord.Message, MessageData)} func
     * @returns {Command}
     */
    setFunction(func: (arg0: Discord.Message, arg1: MessageData) => any): Command;
    func: (arg0: Discord.Message, arg1: MessageData) => any;
    /**
     *
     * @param {string} flag
     * @param {string} value
     * @returns {Command}
     */
    setFlag(flag: string, value: string): Command;
    /**
     *
     * @param {string} flag
     * @returns {string}
     */
    getFlag(flag: string): string;
    /**
     * @type {string}
     */
    group: string;
    /**
     * @type {Map<string, Command>}
     */
    subcommands: Map<string, Command>;
    /**
     * @type {Map<string, *>}
     */
    settings: Map<string, any>;
    /**
     * @type {Map<string, *>}
     */
    flags: Map<string, any>;
}
