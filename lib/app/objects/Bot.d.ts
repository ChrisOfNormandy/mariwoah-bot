export = Bot;
declare class Bot {
    constructor(config: any, intents: any);
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
    intents: any;
    client: Client<boolean>;
    prefix: any;
    startupMessage: string;
}
import { Client } from "discord.js";
