const adapter = require('./app/adapter');
const shuffle = require('./app/common/bot/helpers/global/shuffle');
const commandList = adapter.common.bot.global.commandList;

function verify(message, properties, data) {
    return new Promise((resolve, reject) => {
        if (!properties) {
            for (let c in commandList) {
                for (let cmd in commandList[c].commands) {
                    for (let alt in commandList[c].commands[cmd].alternatives) {
                        if (commandList[c].commands[cmd].alternatives[alt] == data.command) {
                            data.command = cmd;
                            properties = commandList[c].commands[cmd]
                            verify(message, properties, data)
                                .then(r => resolve({
                                    permission: r.permission,
                                    properties,
                                    data
                                }))
                                .catch(e => reject(e));
                        }
                    }
                }
            }
        }
        else {
            adapter.rolemanagement.verifyPermission(message, message.author.id, properties.level)
                .then(r => {
                    resolve({
                        permission: r,
                        properties,
                        data
                    })
                })
                .catch(e => {
                    message.channel.send(e);
                    reject(e);
                });
        }
    });
}

function getCommon(name) {
    return commandList.common.commands[name];
}

function getRoleManager(name) {
    return commandList.rolemanager.commands[name];
}
function getMusic(name) {
    return commandList.music.commands[name];
}
function getMinigames(name, section = null) {
    return (section == null)
        ? commandList.minigames.commands[name]
        : commandList.minigames.subcommands[section].commands;
}
function getMeme(name) {
    return commandList.memes.commands[name];
}
function getDungeons(name) {
    return commandList.dungeons.commands[name];
}

function parseCommand(client, message, data) {
    let properties = getCommon(data.command) || getRoleManager(data.command) || getMusic(data.command) || getMinigames(data.command) || getMeme(data.command) || getDungeons(data.command);
    return new Promise((resolve, reject) => {
        verify(message, properties, data)
            .then(result => {
                let value = null;
                switch (result.data.command) {
                    case 'help': {
                        value = adapter.common.bot.features.listHelp(message, data.arguments);
                        break;
                    }
                    case 'clean': {
                        value = adapter.common.bot.features.cleanChat(message);
                        break;
                    }
                    case 'ping': {
                        value = adapter.common.bot.features.ping(message, client);
                        break;
                    }
                    case 'roll': {
                        value = adapter.common.bot.features.roll(message, data.arguments);
                        break;
                    }
                    case 'shuffle': {
                        value = new Promise((resolve, reject) => {
                            adapter.common.bot.global.shuffle(data.arguments[0].split(','))
                                .then(arr => resolve(arr.join(', ')))
                                .catch(e => reject(e));
                        });
                        break;
                    }
                    case 'whoami': {
                        value = adapter.common.bot.features.whoAre.self(message);
                        break;
                    }
                    case 'whoareyou': {
                        value = adapter.common.bot.features.whoAre.member(message);
                        break;
                    }
                    case 'setmotd': {
                        if (data.flags['r'])
                            value = adapter.common.bot.features.motd.set(message, "First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://google.com/");
                        else
                            value = adapter.common.bot.features.motd.set(message, data.arguments.join(' '));
                        break;
                    }
                    case 'motd': {
                        if (data.parameters.boolean['json']) {
                            value = new Promise((resolve, reject) => {
                                adapter.sql.server.getMotd(message.guild.id)
                                    .then(raw => resolve(`> ${raw.replace('\n', '\\n')}`))
                                    .catch(e => reject(e));
                            });
                        }
                        else
                            value = adapter.common.bot.features.motd.get(message);
                        break;
                    }
                    case 'setprefix': {
                        value = adapter.common.bot.features.prefix.set(message, data.arguments[0]);
                        break;
                    }
                    case 'prefix': {
                        value = adapter.common.bot.features.prefix.get(message);
                        break;
                    }

                    // RoleManager

                    case 'warn': {
                        value = adapter.punishments.warn.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data);
                        break;
                    }
                    case 'warnings': {
                        value = adapter.punishments.warn.printAll(message, data.mentions.members.first().id);
                        break;
                    }
                    case 'kick': {
                        value = adapter.punishments.kick.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
                        break;
                    }
                    case 'kicks': {
                        value = adapter.punishments.kick.printAll(message, data.mentions.members.first().id);
                        break;
                    }
                    case 'ban': {
                        value = adapter.punishments.ban.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
                        break;
                    }
                    case 'bans': {
                        adapter.punishments.ban.printAll(message, data.mentions.members.first().id);
                        break;
                    }
                    case 'unban': {
                        value = new Promise((resolve, reject) => {
                            message.guild.members.unban(data.arguments[0])
                                .then(user => {
                                    user.send(`You have been unbanned from ${message.guild.name}.`);
                                    resolve(`Unbanned ${user.username}.`);
                                })
                                .catch(e => reject()`Cannot unban user.\n${e.message}`);
                        });
                        break;
                    }

                    // case 'pardon': {
                    //     verify(message, getRoleManager('pardon'))
                    //         .then(() => resolve(common.roleManager.pardonUser(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(3).join(' '), data.arguments[1], data.arguments[2])))
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    case 'promote': {
                        value = adapter.rolemanagement.setPermission.promote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
                        break;
                    }
                    case 'demote': {
                        value = adapter.rolemanagement.setPermission.demote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
                        break;
                    }
                    case 'setbotadmin': {
                        value = adapter.rolemanagement.setRank.admin(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
                        break;
                    }
                    case 'setbotmod': {
                        value = adapter.rolemanagement.setRank.moderator(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
                        break;
                    }
                    case 'setbothelper': {
                        value = adapter.rolemanagement.setRank.helper(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
                        break;
                    }
                    case 'refreshrole': {
                        value = adapter.rolemanagement.setRoles.refresh_user(message, message.mentions.members.first() || message.member);
                        break;
                    }
                    case 'refreshroles': {
                        value = adapter.rolemanagement.setRoles.refresh_guild(message);
                        break;
                    }
                    case 'resetroles': {
                        value = adapter.rolemanagement.setRoles.reset_guild(message);
                        break;
                    }
                    case 'purgeroles': {
                        value = adapter.rolemanagement.setRoles.purge(message);
                        break;
                    }
                    case 'setrole': {
                        value = adapter.rolemanagement.setRoles.setRole(message, data.arguments[0], message.mentions.roles.first());
                        break;
                    }

                    // Minigames
                    // case 'stats': {
                    //     switch (data.arguments[0]) {
                    //         case 'fishing': {
                    //             value = adapter.minigames.fishing.print(message);
                    //             break;
                    //         }
                    //         default: {
                    //             value = adapter.minigames.printStats(message);
                    //             break;
                    //         }
                    //     }
                    // }

                    // case 'cast': {
                    //     verify(message, getMinigames('cast', 'fishing').permissionLevel)
                    //         .then(() => resolve(adapter.minigames.fishing.cast(message)))
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    // case 'slots': { }
                    // case 'blackjack': {
                    //     verify(message, getMinigames(command, 'gambling'))
                    //         .then(() => resolve(common.minigames.run(message, 'gambling', command)))
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    // case 'cast': {
                    //     verify(message, getMinigames('cast', 'fishing'))
                    //         .then(() => resolve(common.minigames.run(message, 'fishing', 'cast')))
                    //         .catch(r => reject(r));
                    //     break;
                    // }


                    // case 'inv': {
                    //     verify(message, getMinigames('inv'))
                    //         .then(() => resolve(common.minigames.listInv(message)))
                    //         .catch(r => reject(r));
                    //     break;
                    // }
                    // case 'sell': {
                    //     verify(message, getMinigames('sell'))
                    //         .then(() => resolve(common.minigames.sellInv(message)))
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    // Music

                    case 'play': {
                        if (!data.urls.length)
                            value = adapter.music.append.byName(message, data.arguments.join(' '));
                        else {
                            if (data.flags['s']) {
                                value = new Promise((resolve, reject) => {
                                    value = shuffle(data.urls)
                                        .then(songUrls => resolve(adapter.music.append.byURLArray(message, songUrls, data.flags)))
                                        .catch(e => reject(e));
                                });
                            }
                            else
                                value = adapter.music.append.byURLArray(message, data.urls);
                        }
                        break;
                    }
                    case 'join': {
                        value = adapter.music.join(message);
                        break;
                    }
                    case 'leave': {
                        value = adapter.music.leave(message);
                        break;
                    }
                    case 'skip': {
                        value = adapter.music.skip(message);
                        break;
                    }
                    case 'stop': {
                        value = adapter.music.stop(message);
                        break;
                    }
                    case 'queue': {
                        value = adapter.music.list(message);
                        break;
                    }
                    case 'pause': {
                        adapter.music.pause(message);
                        break;
                    }
                    case 'resume': {
                        value = adapter.music.resume(message);
                        break;
                    }
                    case 'songinfo': {
                        if (!data.arguments.join(' ').includes('youtube.com/watch?'))
                            value = adapter.music.info(message, null, data.arguments.join(' '));
                        else
                            value = adapter.music.info(message, data.arguments[0], null);
                    }

                    // case 'rmqueue': { }
                    // case 'removefromqueue': {
                    //     verify(message, getMusic('removefromqueue'))
                    //         .then(() => resolve(adapter.music.removeFromQueue(message, data.arguments[0])))
                    //         .catch(r => reject(r));
                    //     break;
                    // }
                    // case 'songinfo': {
                    //     verify(message, getMusic('songinfo'))
                    //         .then(() => {
                    //             if (!data.arguments.join(' ').includes('youtube.com/watch?'))
                    //                 resolve(adapter.music.songInfo(message, null, data.arguments.join(' ')));
                    //             else resolve(adapter.music.songInfo(message, data.arguments[0], null));
                    //         })
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    case 'playlist': {
                        value = adapter.music.playlistCommand(message, data.arguments);
                        break;
                    }

                    // Memes

                    case 'f': {
                        value = adapter.memes.memeDispatch(message, 'f');
                        break;
                    }
                    case 'fuck': {
                        value = adapter.memes.memeDispatch(message, 'fuuu');
                        break;
                    }
                    case 'yey': {
                        value = adapter.memes.memeDispatch(message, 'yey');
                        break;
                    }
                    case 'penguin': {
                        value = adapter.memes.memeDispatch(message, 'penguin');
                        break;
                    }
                    case 'clayhead': {
                        value = adapter.memes.memeDispatch(message, 'clayhead')
                        break;
                    }
                    case 'crabrave': {
                        value = adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM');
                        break;
                    }
                    case 'theriddle': {
                        value = adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI');
                        break;
                    }

                    // Dungeons

                    // case 'dd_loaditems': {
                    //     verify(message, getDungeons('dd_loaditems'))
                    //         .then(() => resolve(adapter.dungeons.csvToMap()))
                    //         .catch(r => reject(r));
                    //     break;
                    // }
                    // case 'dd_getitem': {
                    //     verify(message, getDungeons('dd_getitem'))
                    //         .then(() => resolve(adapter.dungeons.getItem(message, data.arguments.join(' '))))
                    //         .catch(r => reject(r));
                    //     break;
                    // }
                    // case 'dd_getshop': {
                    //     verify(message, getDungeons('dd_getshop'))
                    //         .then(() => resolve(adapter.dungeons.getShop(message, (!isNaN(data.arguments[0]) ? data.arguments[0] : 10))))
                    //         .catch(r => reject(r));
                    // }
                    // case 'dd_list': {
                    //     verify(message, getDungeons('dd_list'))
                    //         .then(() => resolve(adapter.dungeons.listItems(message, data.arguments.join(' '))))
                    //         .catch(r => reject(r));
                    //     break;
                    // }

                    // case 'isadmin': {
                    //     adapter.rolemanagement.getRoles.admin(message, message.member);
                    //     break;
                    // }

                    default: {
                        value = null;
                        break;
                    }
                }

                resolve({
                    value,
                    result
                });
            })
            .catch(r => reject(r));
    });
}

function formatResponse(input) {
    return new Promise((resolve, reject) => {
        switch (typeof input) {
            case 'string': resolve(input);
            case 'undefined': resolve(null);
            default: {
                try {
                    input
                        .then(val => resolve(formatResponse(val)))
                        .catch(e => reject(e));
                }
                catch {
                    resolve(input);
                }
                break;
            }
        }
    });
}

module.exports = function (client, message) {
    return new Promise((resolve, reject) => {
        adapter.sql.server.getPrefix(message.guild.id)
            .then(prefix => {
                let msgArray = message.content.split(' ');
                let content = msgArray.slice(1).join(' ').toString();

                let reg = `[${prefix.toString()}](\\w|[?])+`;

                let commandRegex = new RegExp(reg);
                let flagRegex = /-[a-zA-Z]+/g;
                let boolParamRegex = /\?\w+:(t|f)/g;
                let stringParamRegex = /\$\w+:".*?"/g;
                let grepParamRegex = /grep:'\/.+?\/[gimsuy]?'/g;
                let intParamRegex = /\^\w+:-?\d+/g;
                let doubleParamRegex = /%\w+:-?\d+\.\d+/g;

                if (!commandRegex.test(msgArray[0])) {
                    reject(null);
                }
                else {
                    let flags = {};
                    if (content.match(flagRegex) != null) {
                        let flagArr = content.match(flagRegex)[0].slice(1).split('');
                        for (let i in flagArr) {
                            flags[flagArr[i]] = true;
                        }
                    }
                    content = content.replace(flagRegex, '');

                    let bools = content.match(boolParamRegex);
                    content = content.replace(boolParamRegex, '');

                    let strs = content.match(stringParamRegex);
                    content = content.replace(stringParamRegex, '');

                    let greps = content.match(grepParamRegex);
                    content = content.replace(grepParamRegex, '');

                    let ints = content.match(intParamRegex);
                    content = content.replace(intParamRegex, '');

                    let doubles = content.match(doubleParamRegex);
                    content = content.replace(doubleParamRegex, '');

                    let urls = content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

                    if (!urls)
                        urls = [];

                    let params = {
                        "boolean": {},
                        "string": {},
                        "integer": {},
                        "double": {},
                        "regex": []
                    };

                    let arr;
                    
                    for (let i in bools) {
                        arr = bools[i].slice(1).split(':');
                        if (arr.length)
                            params.boolean[arr[0]] = arr[1] === 't';
                    }
                    for (let i in strs) {
                        arr = strs[i].slice(1).split(':');
                        if (arr.length)
                            params.string[arr[0]] = arr[1].replace(/'/g, ``).replace(/"/g, ``);
                    }
                    for (let i in ints) {
                        arr = ints[i].slice(1).split(':');
                        if (arr.length)
                            params.integer[arr[0]] = Number(arr[1]);
                    }
                    for (let i in doubles) {
                        arr = doubles[i].slice(1).split(':');
                        if (arr.length)
                            params.double[arr[0]] = Number(arr[1]);
                    }
                    for (let i in greps) {
                        arr = greps[i].slice(6).slice(0, -1);
                        params.regex.push(arr);
                    }

                    arr = content.split(' ');
                    let args = [];
                    for (let i in arr) {
                        if (arr[i] !== '')
                            args.push(arr[i])
                    }

                    let data = {
                        command: msgArray[0].slice(1),
                        arguments: args,
                        flags,
                        parameters: params,
                        urls,
                        mentions: {
                            members: message.mentions.members,
                            roles: message.mentions.roles
                        }
                    };

                    parseCommand(client, message, data)
                        .then(r => {
                            console.log();
                            if (r.value) {
                                formatResponse(r.value)
                                    .then(msg => message.channel.send(msg))
                                    .catch(e => reject(e));
                            }
                            if (data.parameters.boolean['debug'])
                                message.channel.send(adapter.common.debug(r));
                            if (r.result.properties.selfClear && !data.flags['C'])
                                message.delete();

                            resolve(r);
                        })
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}