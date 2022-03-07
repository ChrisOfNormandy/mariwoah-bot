export = Bot;
declare class Bot {
    /**
     *
     * @param {*} config
     * @param {Intents[]} intents
     * @param {*} commands
     */
    constructor(config: any, intents: Intents[], commands: any);
    /**
     *
     * @param {{devEnabled: boolean}} options
     * @returns
     */
    cleanOptions(options: {
        devEnabled: boolean;
    }): {
        devEnabled: boolean;
    };
    _formatStr(str: any): any;
    /**
     *
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<{bot: Discord.Client}>}
     */
    startup(options?: {
        devEnabled: boolean;
    }): Promise<{
        bot: Discord.Client;
    }>;
    setStatus(str: any, statusType?: string): Bot;
    status: string;
    statusType: string;
    config: any;
    intents: Intents[];
    client: Client<boolean>;
    prefix: any;
    startupMessage: string;
}
import { Intents } from "discord.js";
import { Client } from "discord.js";
