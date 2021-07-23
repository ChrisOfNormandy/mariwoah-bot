const Discord = require('discord.js');

const config = require('../../../config/config.json');

const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const flagRegex = /\s-[a-zA-Z]+\b/g;
const userMentionsRegex = /<@!\d{18}>/g;

class MessageData {
    /**
     * 
     * @param {string} content 
     */
    build(content) {
        let str = content;

        let mentions = content.match(userMentionsRegex);
        if (mentions !== null) {
            for (let m in mentions) {
                this.mentions.push(mentions[m].match(/\d{18}/)[0]);
                str.replace(mentions[m], `<USER:${m}>`);
            }
        }

        const urls = content.match(urlRegex);
        if (urls !== null) {
            for (let url in urls) {
                this.urls.push(urls[url]);
                str.replace(urls[url], `<URL:${url}>`);
            }
        }

        const flags_ = str.match(flagRegex);
        if (flags_ !== null) {
            for (let flag in flags_) {
                str = str.replace(flags_[flag], ``);
                flags_[flag] = flags_[flag].slice(2);

                if (flags_[flag].length > 1) {
                    let arr = flags_[flag].split('');
                    for (let i in arr)
                        if (!this.flags.has(arr[i]))
                            this.flags.set(arr[i], true);
                }
                else
                    this.flags.set(flags_[flag], true);
            }
        }

        this.content = str;
    }

    /**
     * 
     * @returns {string}
     */
    getPrefix() {
        return config.settings.commands.prefix;
    }

    /**
     * 
     * @param  {...string} args 
     */
    setArguments(...args) {
        this.arguments = args;
    }

    /**
     * 
     * @param {string} cmd 
     */
    setCommand(cmd) {
        this.command = cmd;
    }

    /**
     * 
     * @param {string} sCmd 
     */
    setSubcommand(sCmd) {
        this.subcommand = sCmd;
    }

    /**
     * 
     * @param {string} content 
     */
    setContent(content) {
        this.content = content;
    }

    /**
     * 
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    constructor(client, message) {
        this.client = client;

        this.arguments = [];
        this.command = null;
        this.prefix = this.getPrefix();
        this.subcommand = null;
        this.content = message.content;
        this.urls = [];
        this.flags = new Map();
        this.parameters = {
            integer: {}
        };
        this.mentions = [];
        this.admin = message.member.hasPermission('ADMINISTRATOR');

        this.build(message.content);
    }
}

module.exports = MessageData;