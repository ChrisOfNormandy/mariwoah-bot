export = help;
/**
 *
 * @param {MessageData} data
 * @param {Command[]} list
 * @returns {Promise<Output>}
 */
declare function help(data: MessageData, list: Command[]): Promise<Output>;
import Output = require("./objects/Output");
