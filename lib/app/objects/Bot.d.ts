export = Bot;
declare class Bot {
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
    /**
     *
     * @param {*} clientConfig
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<{bot: Discord.Client}>}
     */
    startup(clientConfig: any, intents: Intents[], options?: {
        devEnabled: boolean;
    }): Promise<{
        bot: Discord.Client;
    }>;
}
import { Intents } from "discord.js";
