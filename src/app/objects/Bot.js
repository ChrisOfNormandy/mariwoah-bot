// eslint-disable-next-line no-unused-vars
const { Intents, Client } = require('discord.js');
const { getTimestamp } = require('../handlers').time;

const parse = require('../parser/parse');
const { logging } = require('../logging/logging');

class Bot {
    /**
     * 
     * @param {{devEnabled: boolean}} options 
     * @returns 
     */
    cleanOptions(options) {
        let opts = options;

        if (opts.devEnabled === undefined)
            opts.devEnabled = false;

        return opts;
    }

    /**
     * 
     * @param {*} clientConfig 
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<{bot: Discord.Client}>}
     */
    startup(clientConfig, intents, options = { devEnabled: false, database: null }) {

        let opts = this.cleanOptions(options);

        const client = new Client({ intents });
        if (clientConfig.auth.token)
            client.login(clientConfig.auth.token);
        else
            return Promise.resolve(null);

        const prefix = clientConfig.settings.commands.prefix || '/';

        return new Promise((resolve) => {
            client.on('messageCreate', (message) => {
                if (!message.author.bot) {
                    let start = Date.now();

                    parse(client, message, prefix, opts)
                        .then((response) => {
                            let end = Date.now();

                            if (clientConfig.settings.dev.enabled) {
                                console.log(getTimestamp(start, end));
                                console.log(response);
                            }
                        })
                        .catch((err) => {
                            if (err !== null)
                                logging.error(err, message.content);
                        });
                }
            });

            client.on('ready', () => {
                console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
                client.user.setActivity('chat. | ~? | ~help', { type: 'WATCHING' });

                resolve({ bot: client });
            });
        });
    }

    constructor() { }
}

module.exports = Bot;
