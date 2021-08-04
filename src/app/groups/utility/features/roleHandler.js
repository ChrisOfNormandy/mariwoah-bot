const Discord = require('discord.js');
const { MessageData, Output } = require("@chrisofnormandy/mariwoah-bot");
const { s3 } = require('../../../helpers/aws');
const config = require('../../../../../config/config.json');

/**
 * @type {Map<string, Map<string, Map<string, NodeJS.Timeout>>>}
 */
const timeouts = new Map();

function timedRoles() {
    return { guilds: {} };
}

/**
 * 
 * @param {string} guild
 * @param {string} member 
 * @param {string} role 
 * @param {number} time
 * @returns {Promise<*>}
 */
function handleAutoRemoval(guildId, memberId, roleId, time) {
    return new Promise((resolve, reject) => {
        s3.object.get(config.settings.aws.s3.bucket, `guilds/${guildId}/timed_roles.json`)
            .then(data => {
                let json = JSON.parse(data.Body.toString());

                if (!json.guilds)
                    json.guilds = {};
                if (!json.guilds[guildId])
                    json.guilds[guildId] = { members: {} };
                if (!json.guilds[guildId].members[memberId])
                    json.guilds[guildId].members[memberId] = { roles: {} };

                json.guilds[guildId].members[memberId].roles[roleId] = {
                    startTime: Date.now(),
                    endTime: Date.now() + time
                };

                s3.object.putData(config.settings.aws.s3.bucket, `guilds/${guildId}`, 'timed_roles.json', JSON.stringify(json))
                    .then(() => resolve(json))
                    .catch(err => reject(err));
            })
            .catch(err => {
                if (err.code === 'NoSuchKey') {
                    s3.object.putData(config.settings.aws.s3.bucket, `guilds/${guildId}`, 'timed_roles.json', '{}')
                        .then(() =>
                            handleAutoRemoval(guildId, memberId, roleId, time)
                                .then(r => resolve(r))
                                .catch(err => reject(err))
                        )
                        .catch(err => console.error(err));
                }
                else
                    reject(err);
            });
    });
}

function handleTimedRoles(guild) {
    s3.object.get(config.settings.aws.s3.bucket, `guilds/${guild.id}/timed_roles.json`)
        .then(data => {
            console.log(data);
        })
        .catch(err => console.error(err));
}

function _getTimedRoles(guildId) {
    return new Promise((resolve, reject) => {
        s3.object.get(config.settings.aws.s3.bucket, `guilds/${guildId}/timed_roles.json`)
            .then(data => {
                let json = JSON.parse(data.Body.toString());

                if (!json.guilds[guildId])
                    reject(null);
                else
                    resolve(json);
            })
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
function clearTimedRoles(message, data) {
    return new Promise((resolve, reject) => {
        _getTimedRoles(message.guild.id)
            .then(json => {
                try {
                    message.guild.members.fetch()
                        .then(members => {
                            for (let m in json.guilds[message.guild.id].members) {
                                for (let r in json.guilds[message.guild.id].members[m].roles) {
                                    members.get(m).roles.remove(message.guild.roles.cache.get(r));
                                }
                            }
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
                catch (err) {}

                s3.object.putData(config.settings.aws.s3.bucket, `guilds/${message.guild.id}`, 'timed_roles.json', JSON.stringify(timedRoles()))
                    .then(() => resolve(new Output()))
                    .catch(err => reject(new Output().setError(err)));
            })
            .catch(err => reject(new Output().setError(err)));
        
    });
}

/**
 * 
 * @param {Discord.Message} message
 * @param {*} json 
 * @param {Discord.GuildMember} member
 */
function _MemberHandler(message, json, member) {
    if (!json.guilds[message.guild.id].members[member.id])
        return {
            doUpdate: false,
            str: ''
        };

    let roles = json.guilds[message.guild.id].members[member.id].roles;

    if (!Object.keys(roles).length) {
        delete json.guilds[message.guild.id].members[member.id];
        doUpdate = true;
    }
    else {
        for (let r in roles) {
            if (!roles[r]) {
                doUpdate = true;
                delete json.guilds[message.guild.id].members[m].roles[r];
                continue;
            }

            let time = roles[r].endTime - Date.now();
            if (time > 0) {
                let t = time;
                let days = Math.floor(t / (24 * 60 * 60 * 1000));
                t -= days * 24 * 60 * 60 * 1000;
                let hours = Math.floor(t / (60 * 60 * 1000));
                t -= hours * 60 * 60 * 1000;
                let minutes = Math.floor(t / (60 * 1000));
                t -= minutes * 60 * 1000;
                let seconds = Math.floor(t / 1000);

                str += `${message.guild.roles.cache.get(r).name}: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.\n`;
            }
            else {
                doUpdate = true;
                member.roles.remove(r);
                delete json.guilds[message.guild.id].members[m].roles[r];
            }
        }
    }

    return {
        doUpdate,
        str
    };
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function getTimedRoles(message, data) {
    return new Promise((resolve, reject) => {
        _getTimedRoles(message.guild.id)
            .then(_json => {
                const json = _json;
                let doUpdate = false;

                let embed = new Discord.MessageEmbed()
                    .setTitle('Timed Roles');

                if (data.mentions.length) {
                    data.mentions.forEach(id => {
                        if (!message.guild.members.cache.has(id)) {
                            reject(new Output().setError(new Error('Could not find cached member.')));
                        }
                        else {
                            let member = message.guild.members.cache.get(id);

                            let v = _MemberHandler(message, json, member).doUpdate;
                            doUpdate = v.doUpdate;

                            if (!!v.str)
                                embed.addField(member.nickname || member.user.username, v.str);
                        }
                    });

                    if (doUpdate) {
                        s3.object.putData(config.settings.aws.s3.bucket, `guilds/${message.guild.id}`, 'timed_roles.json', JSON.stringify(json))
                            .then(() => resolve(!!embed.fields.length ? new Output({ embed }) : new Output()))
                            .catch(err => reject(new Output().setError(err)));
                    }
                    else {
                        resolve(!!embed.fields.length ? new Output({ embed }) : new Output());
                    }
                }
                else {
                    message.guild.members.cache.forEach(member => {
                        let v = _MemberHandler(message, json, member).doUpdate;
                        doUpdate = v.doUpdate;

                        if (!!v.str)
                            embed.addField(member.nickname || member.user.username, v.str);
                    });

                    if (doUpdate) {
                        s3.object.putData(config.settings.aws.s3.bucket, `guilds/${message.guild.id}`, 'timed_roles.json', JSON.stringify(json))
                            .then(() => resolve(!!embed.fields.length ? new Output({ embed }) : new Output()))
                            .catch(err => reject(new Output().setError(err)));
                    }
                    else {
                        resolve(!!embed.fields.length ? new Output({ embed }) : new Output());
                    }
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function add(message, data) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch()
            .then(roles => {
                let role = roles.cache.get(data.roles[data.arguments[1]]);
                if (!role)
                    reject(new Output().setError(new Error(`Failed to find a role ${data.arguments[1]}.`)));
                else {
                    message.guild.members.fetch()
                        .then(members => {
                            let member = members.get(data.mentions[data.arguments[0]]);
                            member.roles.add(role);

                            if (!!data.arguments[2]) {
                                let timeArr = data.arguments[2].split(/:/g).reverse();
                                let seconds = timeArr[0];
                                let minutes = timeArr[1] || 0;
                                let hours = timeArr[2] || 0;
                                let days = timeArr[3] || 0;
                                let ms = seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000 + days * 24 * 60 * 60 * 1000;

                                handleAutoRemoval(message.guild.id, member.id, role.id, ms)
                                    .then(json => {
                                        if (!timeouts.has(message.guild.id))
                                            timeouts.set(message.guild.id, new Map());
                                        if (!timeouts.get(message.guild.id).has(member.id))
                                            timeouts.get(message.guild.id).set(member.id, new Map());
                                        if (!timeouts.get(message.guild.id).get(member.id).has(role.id)) {
                                            timeouts.get(message.guild.id).get(member.id).set(role.id, setTimeout(() => {
                                                member.roles.remove(role);
                                            }, ms));

                                            resolve(new Output(`${member.nickname || member.user.username} will have the role ${role.name} for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`));
                                        }
                                        else {
                                            clearTimeout(timeouts.get(message.guild.id).get(member.id).get(role.id));
                                            timeouts.get(message.guild.id).get(member.id).set(role.id, setTimeout(() => {
                                                member.roles.remove(role);
                                            }, ms));

                                            json.guilds[message.guild.id].members[member.id].roles[role.id] = undefined;

                                            s3.object.putData(config.settings.aws.s3.bucket, `guilds/${message.guild.id}`, 'timed_roles.json', JSON.stringify(json))
                                                .then(() => resolve(new Output(`${member.nickname || member.user.username} will have the role ${role.name} for ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds.`).setValues(json)))
                                                .catch(err => reject(new Output().setError(err)));
                                        }
                                    })
                                    .catch(err => reject(new Output().setError(err)));
                            }
                            else
                                resolve(new Output());
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function remove(message, data) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch()
            .then(roles => {
                let role = roles.cache.get(data.roles[data.arguments[1]]);
                if (!role)
                    reject(new Output().setError(new Error(`Failed to find a role ${data.arguments[1]}.`)));
                else {
                    message.guild.members.fetch()
                        .then(members => {
                            members.get(data.mentions[data.arguments[0]]).roles.remove(role);
                            resolve(new Output(`Removed role.`));
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function create(message, data) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch()
            .then(roles => {
                let role = roles.cache.filter(role => role.name === data.arguments[0]).array();
                if (!!role.length && !data.flags.has('f'))
                    reject(new Output().setError(new Error(`Role already exists.`)));
                else {
                    message.guild.roles.create(
                        {
                            data: {
                                name: data.arguments[0]
                            },
                            reason: 'This role was created using Mariwoah-Bot.'
                        }
                    )
                        .then(role => {
                            let promiseArr = [];

                            message.guild.channels.cache.forEach(channel => {
                                promiseArr.push(channel.createOverwrite(role, {
                                    'SEND_MESSAGES': !data.flags.has('m'),
                                    'CONNECT': !data.flags.has('M'),
                                    'VIEW_CHANNEL': !data.flags.has('v')
                                }));
                            });

                            Promise.all(promiseArr)
                                .then(() => resolve(new Output(`Created new role named ${role.name}.`).setValues(role)))
                                .catch(err => reject(new Output().setError(err)));
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

module.exports = {
    add,
    remove,
    create,
    getTimedRoles,
    handleAutoRemoval,
    handleTimedRoles,
    clearTimedRoles
};