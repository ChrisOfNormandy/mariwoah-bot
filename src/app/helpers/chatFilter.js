const Discord = require('discord.js');

const cache = require('./filter/cache');

const filterBypass = require('./filter/bypassRoleNames.json');

const getFilter = require('./filter/get');

function getFilters(guildId) {
    if (!cache.has(guildId)) {
        console.log('Adding filters to cache.');

        return new Promise((resolve, reject) => {
            let ret = {
                banned: null,
                kicked: null,
                warned: null,
                banList: [],
                kickList: [],
                warnList: []
            };

            getFilter(guildId, 'banned')
                .then(list => {
                    if (!!list.length) {
                        let banReg = '';
                        list.forEach((str, i) => {
                            banReg += `(${str}\\b)`;
                            if (i < list.length - 1)
                                banReg += '|'
                        });

                        ret.banned = new RegExp(banReg, 'g');
                        ret.banList = list;
                    }
                })
                .catch(err => {/*console.log('No banned filter.')*/})
                .then(() => {
                    getFilter(guildId, 'kicked')
                        .then(list => {
                            if (!!list.length) {
                                let kickReg = '';
                                list.forEach((str, i) => {
                                    kickReg += `(${str}\\b)`;
                                    if (i < list.length - 1)
                                        kickReg += '|'
                                });

                                ret.kicked = new RegExp(kickReg, 'g');
                                ret.kickList = list;
                            }
                        })
                        .catch(err => {/*console.log('No kicked filter.')*/ })
                        .then(() => {
                            getFilter(guildId, 'warned')
                                .then(list => {
                                    if (!!list.length) {
                                        let warnReg = '';
                                        list.forEach((str, i) => {
                                            warnReg += `(${str}\\b)`;
                                            if (i < list.length - 1)
                                                warnReg += '|'
                                        });

                                        ret.warned = new RegExp(warnReg, 'g');
                                        ret.warnList = list;
                                    }
                                })
                                .catch(err => {/*console.log('No warned filter.')*/ })
                                .then(() => {
                                    cache.set(guildId, ret);
                                    resolve(ret);
                                })
                        })
                })
        });
    }
    else {
        return Promise.resolve(cache.get(guildId));
    }
}

function unique(arr) {
    let list = [];
    arr.forEach(str => {
        if (!list.includes(str))
            list.push(str);
    });
    return list.length;
}

/**
 * 
 * @param {Discord.Message} message 
 */
function ban(message, reason = null) {
    return message.member.ban({ reason: reason === null ? 'Chat filter violation.' : reason })
}

/**
 * 
 * @param {Discord.Message} message 
 */
function kick(message, reason = null) {
    return message.member.kick({ reason: reason === null ? 'Chat filter violation.' : reason })
}

/**
 * 
 * @param {Discord.Message} message 
 * @returns {Promise<boolean>}
 */
module.exports = (message, ignoreAdminBypass = false) => {
    if (!ignoreAdminBypass && (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || !!message.member.roles.cache.filter(role => { return filterBypass.includes(role.name.toLowerCase()) }).size))
        return Promise.resolve(true);

    return new Promise((resolve, reject) => {
        getFilters(message.guild.id)
            .then(filters => {
                const banctx = filters.banned !== null ? message.content.match(filters.banned) : null;
                const kickctx = filters.kicked !== null ? message.content.match(filters.kicked) : null;
                const warnctx = filters.warned !== null ? message.content.match(filters.warned) : null;

                if (banctx !== null) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Ban report:`, `You were automatically banned from ${message.guild.name} for chat filter violations.`)
                        .addField(`Reason:`, `Message contained "${banctx.join('", "')}"`)
                        .addField(`Duration of ban:`, unique(banctx) * banctx.length * 3);

                    message.author.send(embed)
                        .catch(() => console.log('Could not send user a DM.'));


                    ban(message)
                        .then(() => message.channel.send(`<@!${message.author.id}> has been banned for chat violation.`))
                        .catch(err => console.error(err));

                    resolve(false)
                }

                if (kickctx !== null) {
                    message.channel.send(`<@!${message.author.id}> has been kicked for chat violation.`);

                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Kick report:`, `You were automatically kicked from ${message.guild.name} for chat filter violations.`)
                        .addField(`Reason:`, `Message contained "${kickctx.join('", "')}"`);

                    message.author.send(embed)
                        .catch(() => console.log('Could not send user a DM.'));


                    kick(message)
                        .then(() => message.channel.send(`<@!${message.author.id}> has been kicked for chat violation.`))
                        .catch(err => console.error(err));

                    resolve(false)
                }

                if (warnctx !== null) {
                    let msg = message.content;
                    filters.warnList.forEach(str => msg = msg.replace(str, `||${str}||`));
                    message.channel.send(`<@!${message.author.id}> has been issued a warning for chat violation.\n> ${msg}`);

                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Warning report:`, `You were issued a warning from ${message.guild.name} for chat filter violations.`)
                        .addField(`Reason:`, `Message contained "${warnctx.join('", "')}"`);

                    message.author.send(embed)
                        .catch(() => console.log('Could not send user a DM.'));

                    resolve(false)
                }

                resolve(true)
            })
            .catch(err => reject(err));
    });
}