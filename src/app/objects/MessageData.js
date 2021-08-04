const Discord = require('discord.js');
const Output = require('./Output');

const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const flagRegex = /\s-[a-zA-Z]+\b/g;

const userMentionsRegex = /<@!\d{18}>/g;
const roleMentionsRegex = /<@&\d{18}>/g;

const variableRegex = /\{\w\}/g;
const variableRegex_ = /\{(\w)\}/;

const varOutputRegex = /(.+?)\s>\s(\w)/;

const pipedCommandRegex = /(.+?)\s\|\s(.+)/;

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
                str = str.replace(mentions[m], `<USER:${m}>`);
            }
        }

        let roles = content.match(roleMentionsRegex);
        if (roles !== null) {
            for (let m in roles) {
                this.roles.push(roles[m].match(/\d{18}/)[0]);
                str = str.replace(roles[m], `<ROLE:${m}>`);
            }
        }

        const urls = content.match(urlRegex);
        if (urls !== null) {
            for (let url in urls) {
                this.urls.push(urls[url]);
                str = str.replace(urls[url], `<URL:${url}>`);
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

        const variables = content.match(variableRegex);
        if (variables !== null) {
            for (let v in variables) {
                let val = variables[v].match(variableRegex_)[1];
                this.variables.push(val);

                console.log(val, variables[v], this.vars, this.vars.get(val));

                if (this.vars.has(val) && this.vars.get(val) !== undefined)
                    str = str.replace(variables[v], this.vars.get(val));
            }
        }

        this.content = str;
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
     * @param {string} content 
     * @param {Discord.GuildMember} member 
     * @param {string} prefix 
     * @param {Output} ingest
     * @param {MessageData} ingestData
     */
    constructor(client, content, member, prefix = "/", ingest = undefined, ingestData = undefined) {
        this.client = client;

        this.prefix = prefix;
        this.content = content;

        this.command = null;
        this.subcommand = null;

        this.arguments = [];
        this.variables = [];
        this.mentions = [];
        this.roles = [];
        this.urls = [];

        this.flags = new Map();
        this.vars = new Map();
        this.outputs = [];
        
        this.admin = member.hasPermission('ADMINISTRATOR');

        this.hasData = true;

        this.ingest = ingest;

        this.pipedCommand = null;

        if (ingestData !== undefined) {
            console.log('>>>', ingestData.vars);
            ingestData.vars.forEach((v, k) => this.vars.set(k, v));
        }

        let v = this.content.match(varOutputRegex);
        if (v !== null) {
            this.content = this.content.replace(v[0], v[1]);
            this.vars.set(v[2], undefined);
            this.outputs.push(v[2]);
        }

        let pipes = this.content.match(pipedCommandRegex);
        if (pipes !== null) {
            this.content = pipes[1];
            this.pipedCommand = pipes[2];
        }

        if (this.content.split(' ').length > 1)
            this.build(this.content);
    }
}

module.exports = MessageData;