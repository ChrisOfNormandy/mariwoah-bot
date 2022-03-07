"use strict";
// eslint-disable-next-line no-unused-vars
const { Intents, Client } = require('discord.js');
const { getTimestamp } = require('../handlers').time;
const parse = require('../parser/parse');
const { logging } = require('../logging/logging');
const groups = require('../groups');
class Bot {
    /**
     *
     * @param {{devEnabled: boolean}} options
     * @returns
     */
    cleanOptions(options) {
        let opts = options;
        if (!opts.devEnabled)
            opts.devEnabled = false;
        return opts;
    }
    _formatStr(str) {
        return str
            .replace(/%prefix%/g, this.prefix.replace(/\\/g, ''))
            .replace(/%channel_count%/g, this.client.channels.cache.size)
            .replace(/%guild_count%/g, this.client.guilds.cache.size);
    }
    /**
     *
     * @param {Intents[]} intents
     * @param {{devEnabled: boolean}} options
     * @returns {Promise<{bot: Discord.Client}>}
     */
    startup(options = { devEnabled: false, database: null }) {
        let opts = this.cleanOptions(options);
        return new Promise((resolve, reject) => {
            const onMessage = (message) => {
                if (!message.author.bot) {
                    let start = Date.now();
                    parse(this.client, message, this.prefix, opts)
                        .then((response) => {
                        let end = Date.now();
                        if (this.config.settings.dev.enabled) {
                            console.log(getTimestamp(start, end));
                            console.log(response);
                        }
                        if (this.config.settings.logging.enabled) {
                            this.config.settings.logging.channels.forEach((log) => {
                                this.client.guilds.fetch(log.guild)
                                    .then((guild) => {
                                    if (log.options.onStart)
                                        guild.channels.cache
                                            .get(log.channel)
                                            .send('This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.');
                                    resolve({ bot: this.client });
                                })
                                    .catch((err) => console.error('Failed to fetch guild.', err));
                            });
                        }
                    })
                        .catch((err) => {
                        if (err !== null) {
                            logging.error(err, message.content);
                            reject(err);
                        }
                    });
                }
            };
            /**
             *
             * @param {Client} client
             */
            const onReady = (client) => {
                console.log(this._formatStr(this.startupMessage));
                this.setStatus(this.status, this.statusType);
                if (this.config.settings.logging.enabled) {
                    this.config.settings.logging.channels.forEach((log) => {
                        client.guilds.fetch(log.guild)
                            .then((guild) => {
                            if (log.options.onStart)
                                guild.channels.cache
                                    .get(log.channel)
                                    .send('This bot has been configured to output logging notifications to this channel.\nThis is a startup notice.');
                        })
                            .catch((err) => console.error('Failed to fetch guild.', err));
                    });
                }
            };
            const onError = (err) => {
                console.error(err);
            };
            const onLogin = () => {
                console.log('Logged in successfully.');
                this.client.on('ready', onReady);
                this.client.on('error', onError);
                this.client.on('messageCreate', onMessage);
            };
            if (this.config.auth.token) {
                this.client.login(this.config.auth.token)
                    .then(onLogin)
                    .catch((err) => reject(err));
            }
            else
                reject(new Error('No token.'));
        });
    }
    setStatus(str, statusType = 'WATCHING') {
        this.status = str;
        this.statusType = statusType;
        if (this.client.user !== null)
            this.client.user.setActivity(this._formatStr(this.status), { type: this.statusType });
        return this;
    }
    /**
     *
     * @param {*} config
     * @param {Intents[]} intents
     * @param {*} commands
     */
    constructor(config, intents, commands) {
        this.config = config;
        this.intents = intents;
        this.client = new Client({ intents: this.intents });
        this.prefix = this.prefix = this.config.settings.commands.prefix || '~';
        this.statusType = 'WATCHING';
        this.startupMessage = 'Bot has started in %channel_count% channels of %guild_count% guilds.';
        this.status = 'chat. | %prefix%? | %prefix%help';
        for (let i in commands)
            commands[i].forEach((command) => groups.addCommandGroup(i).addCommand(command));
    }
}
module.exports = Bot;
