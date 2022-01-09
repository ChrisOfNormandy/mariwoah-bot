export = parse;
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} prefix
 * @param {{devEnabled: boolean}} options
 * @returns {Promise<Output>}
 */
declare function parse(client: Discord.Client, message: Discord.Message, prefix: string, options: {
    devEnabled: boolean;
}): Promise<Output>;
import Output = require("../objects/Output");
