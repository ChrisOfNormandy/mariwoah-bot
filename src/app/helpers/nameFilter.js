const Discord = require('discord.js');

const cache = require('./filter/cache');

const filterBypass = require('./filter/bypassRoleNames.json');

const getFilter = require('./filter/getName');

function getFilters(bucket, guildId) {
    if (!cache.has(guildId)) {
        return new Promise((resolve, reject) => {
            let ret = {
                banned: null,
                kicked: null,
                warned: null,
                banList: [],
                kickList: [],
                warnList: []
            };

            getFilter(bucket, guildId, 'banned')
                .then(list => {
                    if (!!list.length) {
                        let banReg = '';
                        list.forEach((str, i) => {
                            banReg += `(${str}\\b)`;
                            if (i < list.length - 1)
                                banReg += '|';
                        });

                        ret.banned = new RegExp(banReg, 'g');
                        ret.banList = list;
                    }
                })
                .catch(err => {/*console.error('No banned filter.')*/ })
                .then(() => {
                    getFilter(bucket, guildId, 'kicked')
                        .then(list => {
                            if (!!list.length) {
                                let kickReg = '';
                                list.forEach((str, i) => {
                                    kickReg += `(${str}\\b)`;
                                    if (i < list.length - 1)
                                        kickReg += '|';
                                });

                                ret.kicked = new RegExp(kickReg, 'g');
                                ret.kickList = list;
                            }
                        })
                        .catch(err => {/*console.error('No kicked filter.')*/ })
                        .then(() => {
                            getFilter(bucket, guildId, 'warned')
                                .then(list => {
                                    if (!!list.length) {
                                        let warnReg = '';
                                        list.forEach((str, i) => {
                                            warnReg += `(${str}\\b)`;
                                            if (i < list.length - 1)
                                                warnReg += '|';
                                        });

                                        ret.warned = new RegExp(warnReg, 'g');
                                        ret.warnList = list;
                                    }
                                })
                                .catch(err => {/*console.error('No warned filter.')*/ })
                                .then(() => {
                                    cache.set(guildId, ret);
                                    resolve(ret);
                                });
                        });
                });
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
 * @param {Discord.GuildMember} message 
 */
function ban(member, reason = null) {
    return member.ban({ reason: reason === null ? 'Name filter violation.' : reason });
}

/**
 * 
 * @param {Discord.GuildMember} member 
 */
function kick(member, reason = null) {
    return member.kick({ reason: reason === null ? 'Name filter violation.' : reason });
}

/**
 * 
 * @param {string} bucket 
 * @param {Discord.GuildMember} member 
 * @param {boolean} changeNickname 
 * @param {boolean} ignoreNickname 
 * @param {boolean} ignoreAdminBypass 
 * @param {{guild: string, channel: string}[]} logChannels
 * @returns {Promise<boolean>}
 */
module.exports = (bucket, member, changeNickname = true, ignoreNickname = false, ignoreAdminBypass = false, logChannels = []) => {
    if (!ignoreAdminBypass && (member.hasPermission('ADMINISTRATOR') || member.hasPermission('MANAGE_MESSAGES') || !!member.roles.cache.filter(role => { return filterBypass.includes(role.name.toLowerCase()); }).size))
        return Promise.resolve(true);

    return new Promise((resolve, reject) => {
        getFilters(bucket, member.guild.id)
            .then(filters => {
                const target = member.nickname === null || ignoreNickname ? member.user.username : member.nickname;

                const banctx = filters.banned !== null ? target.match(filters.banned) : null;
                const kickctx = filters.kicked !== null ? target.match(filters.kicked) : null;
                const warnctx = filters.warned !== null ? target.match(filters.warned) : null;

                if (banctx !== null) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Ban report:`, `You were automatically banned from ${member.guild.name} for name filter violations.`)
                        .addField(`Reason:`, `Name contained "${banctx.join('", "')}"`)
                        .addField(`Duration of ban:`, unique(banctx) * banctx.length * 3);

                    member.user.send(embed)
                        .catch(() => console.error('Could not send user a DM.'));


                    ban(member)
                        .then(() => logChannels.forEach(logChannel => member.guild.channels.cache.get(logChannel.channel).send(`<@!${member.user.id}> has been banned for name violation.`)))
                        .catch(err => console.error(err));

                    resolve(false);
                }

                if (kickctx !== null) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Kick report:`, `You were automatically kicked from ${member.guild.name} for name filter violations.`)
                        .addField(`Reason:`, `Message contained "${kickctx.join('", "')}"`);

                    member.user.send(embed)
                        .catch(() => console.error('Could not send user a DM.'));


                    kick(member)
                        .then(() => logChannels.forEach(logChannel => member.guild.channels.cache.get(logChannel.channel).send(`<@!${member.user.id}> has been kicked for name violation.`)))
                        .catch(err => console.error(err));

                    resolve(false);
                }

                if (warnctx !== null) {
                    let name = member.user.username;
                    warnctx.forEach(str => name = name.replace(str, `||${str}||`));

                    const embed = new Discord.MessageEmbed()
                        .setTitle('Hello.')
                        .addField(`Warning report:`, `You were issued a warning from ${member.guild.name} for name filter violations.`)
                        .addField(`Reason:`, `Message contained "${warnctx.join('", "')}"`);

                    member.user.send(embed)
                        .catch(() => console.error('Could not send user a DM.'));

                    if (changeNickname) {
                        member.setNickname("Please change. :)", { reason: "Name filter violation." })
                            .then(r => resolve(false))
                            .catch(err => {
                                console.error(err);
                                resolve(false);
                            })
                            .then(() => logChannels.forEach(logChannel => member.guild.channels.cache.get(logChannel.channel).send(`<@!${member.user.id}> has been issued a warning for name violation.\n> ${name}`)));
                    }
                    else {
                        logChannels.forEach(logChannel => member.guild.channels.cache.get(logChannel.channel).send(`<@!${member.user.id}> has been issued a warning for name violation.\n> ${name}`));
                        resolve(false);
                    }
                }

                resolve(true);
            })
            .catch(err => reject(err));
    });
};