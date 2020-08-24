const adapter = require('./app/adapter');
const commandList = adapter.common.bot.global.commandList;

function verify(message, properties, data, command) {
    return new Promise((resolve, reject) => {
        if (!properties) {
            for (let c in commandList) {
                for (let cmd in commandList[c].commands) {
                    for (let alt in commandList[c].commands[cmd].alternatives) {
                        if (commandList[c].commands[cmd].alternatives[alt] == command) {
                            command = cmd;
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
        } else {
            adapter.rolemanagement.verifyPermission(message, message.author.id, properties.permissionLevel)
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
    return (section == null) ?
        commandList.minigames.commands[name] :
        commandList.minigames.subcommands[section].commands;
}

function getMeme(name) {
    return commandList.memes.commands[name];
}
// function getDungeons(name) {
//     return commandList.dungeons.commands[name];
// }
function getOther(name, subcommand) {
    try {
        return (subcommand[0])
            ? commandList[name].subcommands[subcommand[0]]
            : commandList[name].commands[name];
    } catch {
        return undefined;
    }
}

function parseCommands(client, message, data) {
    let returns = [];

    return new Promise((resolve, reject) => {
        let properties = null;
        for (let i in data.commands) {
            console.log(data.commands[i])
            properties = getCommon(data.commands[i]) || getRoleManager(data.commands[i]) || getMusic(data.commands[i]) || getMinigames(data.commands[i]) || getMeme(data.commands[i]) || getOther(data.commands[i], data.arguments[i])
            returns[i] = {
                properties,
                result: verify(message, properties, data, data.commands[i]),
                value: []
            }
        }

        Promise.all(returns)
            .then(returns => {
                console.log(returns);
            })
            .catch(e => reject(e));

        // verify(message, properties, data)
        //     .then(result => {
        //         let value = null;

        //         if (result.permission.state) {
        //             switch (result.data.command) {
        //                 case 'help': {
        //                     value = adapter.common.bot.features.listHelp(message, data.arguments);
        //                     break;
        //                 }
        //                 case 'clean': {
        //                     value = adapter.common.bot.features.cleanChat(message);
        //                     break;
        //                 }
        //                 case 'ping': {
        //                     value = adapter.common.bot.features.ping(message, client);
        //                     break;
        //                 }
                        // case 'roll': {
                        //     value = adapter.common.bot.features.roll(data.arguments);
                        //     break;
                        // }
        //                 case 'shuffle': {
        //                     value = new Promise((resolve, reject) => {
        //                         adapter.common.bot.global.shuffle(data.arguments[0].split(','))
        //                             .then(arr => resolve({
        //                                 value: arr.join(', ')
        //                             }))
        //                             .catch(e => reject(e));
        //                     });
        //                     break;
        //                 }
        //                 case 'whoami': {
        //                     value = adapter.common.bot.features.whoAre.self(message);
        //                     break;
        //                 }
        //                 case 'whoareyou': {
        //                     value = adapter.common.bot.features.whoAre.member(message);
        //                     break;
        //                 }
        //                 case 'setmotd': {
        //                     if (data.flags['r'])
        //                         value = adapter.common.bot.features.motd.set(message, "First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://google.com/");
        //                     else
        //                         value = adapter.common.bot.features.motd.set(message, data.arguments.join(' '));
        //                     break;
        //                 }
        //                 case 'motd': {
        //                     value = adapter.common.bot.features.motd.get(message, data);
        //                     break;
        //                 }
        //                 case 'setprefix': {
        //                     value = adapter.common.bot.features.prefix.set(message, data.arguments[0]);
        //                     break;
        //                 }
        //                 case 'prefix': {
        //                     value = adapter.common.bot.features.prefix.get(message);
        //                     break;
        //                 }

        //                 // RoleManager

        //                 case 'warn': {
        //                     value = adapter.punishments.warn.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data);
        //                     break;
        //                 }
        //                 case 'warnings': {
        //                     value = adapter.punishments.warn.printAll(message, data.mentions.members.first().id);
        //                     break;
        //                 }
        //                 case 'kick': {
        //                     value = adapter.punishments.kick.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
        //                     break;
        //                 }
        //                 case 'kicks': {
        //                     value = adapter.punishments.kick.printAll(message, data.mentions.members.first().id);
        //                     break;
        //                 }
        //                 case 'ban': {
        //                     value = adapter.punishments.ban.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
        //                     break;
        //                 }
        //                 case 'bans': {
        //                     adapter.punishments.ban.printAll(message, data.mentions.members.first().id);
        //                     break;
        //                 }
        //                 case 'unban': {
        //                     value = new Promise((resolve, reject) => {
        //                         message.guild.members.unban(data.arguments[0])
        //                             .then(user => {
        //                                 user.send(`You have been unbanned from ${message.guild.name}.`);
        //                                 resolve({
        //                                     value: `Unbanned ${user.username}.`
        //                                 });
        //                             })
        //                             .catch(e => reject(`Cannot unban user.\n${e.message}`));
        //                     });
        //                     break;
        //                 }
        //                 case 'promote': {
        //                     value = adapter.rolemanagement.setPermission.promote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
        //                     break;
        //                 }
        //                 case 'demote': {
        //                     value = adapter.rolemanagement.setPermission.demote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
        //                     break;
        //                 }
        //                 case 'setbotadmin': {
        //                     value = adapter.rolemanagement.setRank.admin(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        //                     break;
        //                 }
        //                 case 'setbotmod': {
        //                     value = adapter.rolemanagement.setRank.moderator(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        //                     break;
        //                 }
        //                 case 'setbothelper': {
        //                     value = adapter.rolemanagement.setRank.helper(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        //                     break;
        //                 }
        //                 case 'refreshrole': {
        //                     value = adapter.rolemanagement.setRoles.refresh_user(message, message.mentions.members.first() || message.member);
        //                     break;
        //                 }
        //                 case 'refreshroles': {
        //                     value = adapter.rolemanagement.setRoles.refresh_guild(message);
        //                     break;
        //                 }
        //                 case 'resetroles': {
        //                     value = adapter.rolemanagement.setRoles.reset_guild(message);
        //                     break;
        //                 }
        //                 case 'purgeroles': {
        //                     value = adapter.rolemanagement.setRoles.purge(message);
        //                     break;
        //                 }
        //                 case 'setrole': {
        //                     value = adapter.rolemanagement.setRoles.setRole(message, data.arguments[0], message.mentions.roles.first());
        //                     break;
        //                 }
        //                 case 'timeout': {
        //                     switch (data.arguments[0]) {
        //                         case 'roles': {
        //                             value = adapter.sql.server.timeouts.toMessage(message);
        //                             break;
        //                         }
        //                     }
        //                     break;
        //                 }

        //                 // Guilds

        //                 case 'guild_admin': {
        //                     switch (data.arguments[0]) {
        //                         case 'refresh': {
        //                             value = adapter.rolemanagement.guilds.update(message, data);
        //                             break;
        //                         }
        //                         case 'other_join': {
        //                             value = adapter.rolemanagement.guilds.admin_join(message, data);
        //                             break;
        //                         }
        //                         case 'other_leave': {
        //                             value = adapter.rolemanagement.guilds.admin_leave(message, data);
        //                             break;
        //                         }
        //                         case 'disband': {
        //                             value = adapter.rolemanagement.guilds.admin_disband(message, data);
        //                             break;
        //                         }
        //                     }
        //                     break;
        //                 }
        //                 case 'guild': {
        //                     switch (data.arguments[0]) {
        //                         case 'create': {
        //                             value = adapter.rolemanagement.guilds.newCandidate(message, data);
        //                             break;
        //                         }
        //                         case 'seticon': {
        //                             value = adapter.rolemanagement.guilds.setIcon(message, data);
        //                             break;
        //                         }
        //                         case 'setcolor': {
        //                             value = adapter.rolemanagement.guilds.setColor(message, data);
        //                             break;
        //                         }
        //                         case 'setlore': {
        //                             value = adapter.rolemanagement.guilds.setLore(message, data);
        //                             break;
        //                         }
        //                         case 'setmotto': {
        //                             value = adapter.rolemanagement.guilds.setMotto(message, data);
        //                             break;
        //                         }
        //                         case 'lore': {
        //                             value = adapter.rolemanagement.guilds.getLore(message, data);
        //                             break;
        //                         }
        //                         case 'list': {
        //                             value = adapter.rolemanagement.guilds.list(message, data);
        //                             break;
        //                         }
        //                         case 'join': {
        //                             value = adapter.rolemanagement.guilds.join(message, data);
        //                             break;
        //                         }
        //                         case 'leave': {
        //                             value = adapter.rolemanagement.guilds.leave(message, data);
        //                             break;
        //                         }
        //                         case 'invite': {
        //                             value = adapter.rolemanagement.guilds.invite(message, data);
        //                             break;
        //                         }
        //                         case 'toggle': {
        //                             value = adapter.rolemanagement.guilds.toggleInvites(message, data);
        //                             break;
        //                         }
        //                         case 'invites': {
        //                             value = adapter.rolemanagement.guilds.getInvites(message, data);
        //                             break;
        //                         }
        //                         case 'deny': {
        //                             value = adapter.rolemanagement.guilds.deleteInvite(message, data);
        //                             break;
        //                         }
        //                         case 'setofficer': {
        //                             value = adapter.rolemanagement.guilds.promote(message, data, 'officer');
        //                             break;
        //                         }
        //                         case 'setleader': {
        //                             value = adapter.rolemanagement.guilds.promote(message, data, 'leader');
        //                             break;
        //                         }
        //                         case 'setmember': {
        //                             value = adapter.rolemanagement.guilds.promote(message, data, 'member');
        //                             break;
        //                         }
        //                         case 'exhile': {
        //                             value = adapter.rolemanagement.guilds.promote(message, data, 'exhiled');
        //                             break;
        //                         }
        //                         case 'settitle': {
        //                             value = adapter.rolemanagement.guilds.setTitle(message, data);
        //                             break;
        //                         }
        //                         case 'help': {
        //                             value = adapter.rolemanagement.guilds.listHelp(message, data);
        //                             break;
        //                         }
        //                         default: {
        //                             value = adapter.rolemanagement.guilds.view(message, data);
        //                             break;
        //                         }
        //                     }
        //                     break;
        //                 }

        //                 // Minigames

        //                 case 'stats': {
        //                     switch (data.arguments[0]) {
        //                         case 'fishing': {
        //                             value = adapter.minigames.stats.fishing(message);
        //                             break;
        //                         }
        //                         default: {
        //                             value = adapter.minigames.stats.all(message);
        //                             break;
        //                         }
        //                     }
        //                     break;
        //                 }
        //                 case 'cast': {
        //                     value = adapter.minigames.fishing.cast(message);
        //                     break;
        //                 }
        //                 case 'inventory': {
        //                     value = adapter.minigames.inventory.find(message, data);
        //                     break;
        //                 }

        //                 // Music

        //                 case 'play': {
        //                     value = adapter.music.append.fetch(message, data);
        //                     break;
        //                 }
        //                 case 'join': {
        //                     value = adapter.music.join(message);
        //                     break;
        //                 }
        //                 case 'leave': {
        //                     value = adapter.music.leave(message);
        //                     break;
        //                 }
        //                 case 'skip': {
        //                     value = adapter.music.skip(message);
        //                     break;
        //                 }
        //                 case 'stop': {
        //                     value = adapter.music.stop(message);
        //                     break;
        //                 }
        //                 case 'queue': {
        //                     value = adapter.music.list(message, data);
        //                     break;
        //                 }
        //                 case 'pause': {
        //                     value = adapter.music.pause(message);
        //                     break;
        //                 }
        //                 case 'resume': {
        //                     value = adapter.music.resume(message);
        //                     break;
        //                 }
        //                 case 'songinfo': {
        //                     value = adapter.music.info(message, data);
        //                     break;
        //                 }

        //                 case 'playlist': {
        //                     value = adapter.music.playlistCommand(message, data);
        //                     break;
        //                 }

        //                 // Memes

        //                 case 'f': {
        //                     value = adapter.memes.memeDispatch('f');
        //                     break;
        //                 }
        //                 case 'fuck': {
        //                     value = adapter.memes.memeDispatch('fuuu');
        //                     break;
        //                 }
        //                 case 'yey': {
        //                     value = adapter.memes.memeDispatch('yey');
        //                     break;
        //                 }
        //                 case 'thowonk': {
        //                     value = adapter.memes.memeDispatch('thowonk');
        //                     break;
        //                 }
        //                 case 'penguin': {
        //                     value = adapter.memes.memeDispatch('penguin');
        //                     break;
        //                 }
        //                 case 'bird': {
        //                     value = adapter.memes.memeDispatch('bird');
        //                     break;
        //                 }
        //                 case 'clayhead': {
        //                     value = adapter.memes.memeDispatch('clayhead');
        //                     break;
        //                 }
        //                 case 'extrathicc': {
        //                     value = adapter.memes.memeDispatch('extra_thicc');
        //                     break;
        //                 }
        //                 case 'crabrave': {
        //                     value = adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM');
        //                     break;
        //                 }
        //                 case 'theriddle': {
        //                     value = adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI');
        //                     break;
        //                 }

        //                 // Dungeons

        //                 // case 'dd_loaditems': {
        //                 //     verify(message, getDungeons('dd_loaditems'))
        //                 //         .then(() => resolve(adapter.dungeons.csvToMap()))
        //                 //         .catch(r => reject(r));
        //                 //     break;
        //                 // }
        //                 // case 'dd_getitem': {
        //                 //     verify(message, getDungeons('dd_getitem'))
        //                 //         .then(() => resolve(adapter.dungeons.getItem(message, data.arguments.join(' '))))
        //                 //         .catch(r => reject(r));
        //                 //     break;
        //                 // }
        //                 // case 'dd_getshop': {
        //                 //     verify(message, getDungeons('dd_getshop'))
        //                 //         .then(() => resolve(adapter.dungeons.getShop(message, (!isNaN(data.arguments[0]) ? data.arguments[0] : 10))))
        //                 //         .catch(r => reject(r));
        //                 // }
        //                 // case 'dd_list': {
        //                 //     verify(message, getDungeons('dd_list'))
        //                 //         .then(() => resolve(adapter.dungeons.listItems(message, data.arguments.join(' '))))
        //                 //         .catch(r => reject(r));
        //                 //     break;
        //                 // }

        //                 // case 'isadmin': {
        //                 //     adapter.rolemanagement.getRoles.admin(message, message.member);
        //                 //     break;
        //                 // }

        //                 default: {
        //                     value = [null];
        //                     break;
        //                 }
                    // }
        //         } else {
        //             value = [result.permission.reason];
        //         }
        //         // console.log(value);
            //     resolve({
            //         values: [value],
            //         result
            //     });
            // })
            // .catch(r => reject(r));
    });
}

function formatResponse(input) {
    // console.log('INPUT: ', input);
    return new Promise((resolve, reject) => {
        if (input.values) {
            // console.log(input.values);
            let arr = [];
            for (let i in input.values) {
                arr.push(formatResponse(input.values[i]))
            }

            Promise.all(arr)
                .then(arr => resolve({
                    values: arr,
                    result: input.result,
                    options: input.options
                }))
                .catch(e => reject(e));
        } else {
            try {
                input
                    .then(val => resolve(formatResponse(val)))
                    .catch(e => reject(e));
            } catch {
                if (input.embed)
                    resolve({
                        value: input.embed,
                        result: input.result,
                        options: input.options
                    });
                else
                    resolve(input);
            }
        }
    });
}

function getData(message, prefix, part) {
    /*
        Parts are split on the pipe |
        There can be multiple commands per part, and everything
        needs to be put into their own sections:

        .roll 5 > x => .roll 3 {x} > y => .roll {x} {y}

        A: .roll 5 > x
        B: .roll 3 {x} > y
        C: .roll {x} > {y}

        A -> x          A => B
        B -> y          B => C
        C -> out        outputVariables: {
                            cache: {
                                x: A,
                                y: B
                            },
                            out: [
                                C
                            ]
                        }
    */

    return new Promise((resolve, reject) => {
        let msgArray = part.split(' ');

        const reg = `[${prefix.toString()}~][a-zA-Z?]+`;
        const commandRegex = new RegExp(reg, 'g');

        if (!commandRegex.test(msgArray[0])) {
            reject(null);
        } else {
            
            const passThrough = `${reg}.*\\s>\\s([a-zA-Z])`;
            const passThroughRegex = new RegExp(passThrough, '');
            const outputVariables = {
                cache: {},
                out: []
            };

            let commands = [];
            let arguments = [];
            let flags = [];
            let parameters = [];
            let urls = [];
            let mentions = [];

            const flagRegex = /-[a-zA-Z]+\s*/g;
            const boolParamRegex = /\?\w+:(t|f)/g;
            const stringParamRegex = /\$\w+:".*?"/g;
            const grepParamRegex = /grep:'\/.+?\/[gimsuy]?'/g;
            const intParamRegex = /\^\w+:-?\d+/g;
            const doubleParamRegex = /%\w+:-?\d+\.\d+/g;

            const mentions_ = {
                members: message.mentions.members,
                roles: message.mentions.roles
            }

            const passThrough_arr = part.split('=>');

            let content = part;
            
            let passTo_arr = [];
            let non_passTo_arr = [];

            for (let i in passThrough_arr) {
                if (passThrough_arr[i].match(passThroughRegex) !== null)
                    passTo_arr.push(passThrough_arr[i].match(passThroughRegex));
                else
                    non_passTo_arr.push(passThrough_arr[i]);
            }
            content = content.replace(flagRegex, '');

            let has_flags = false;

            let str = '';

            for (let i in passTo_arr) {
                str = passTo_arr[i][0];

                outputVariables.cache[passTo_arr[i][1]] = {
                    index: i,
                    value: null
                };

                content = str.replace(new RegExp(reg + '\\s', 'g'), '');
                str = content.replace(/\s>\s.*/g, '');
                
                commands.push(passTo_arr[i][0].split(' >')[0].match(commandRegex)[0]);
                
                has_flags = content.match(flagRegex);

                parameters[i] = {
                    'boolean': [],
                    'string': [],
                    'regex': [],
                    'integer': [],
                    'double': []
                }

                parameters[i]['boolean'].push(content.match(boolParamRegex));
                content = content.replace(boolParamRegex, '');
                parameters[i]['string'].push(content.match(stringParamRegex));
                content = content.replace(stringParamRegex, '');
                parameters[i]['regex'].push(content.match(grepParamRegex));
                content = content.replace(grepParamRegex, '');
                parameters[i]['integer'].push(content.match(intParamRegex));
                content = content.replace(intParamRegex, '');
                parameters[i]['double'].push(content.match(doubleParamRegex));
                content = content.replace(doubleParamRegex, '');

                urls[i] = content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

                console.log(content);

                if (!urls[i])
                    urls[i] = [];

                arguments[i] = str.split(' ');
                if (!arguments[i])
                    arguments[i] = [];

                if (has_flags !== null) {
                    flagArr = content.match(flagRegex)[0].slice(1).split('');
                    for (let x in flagArr) {
                        flags[i][flagArr[x]] = true;
                    }
                    content = content.replace(flagRegex, '');
                }
                else
                    flags[i] = [];

                for (let x in parameters[i].boolean) {
                    if (parameters[i].boolean[x]) {
                        arr = parameters[i].boolean[x].slice(1).split(':');
                        if (arr.length)
                            parameters[i].boolean[arr[0]] = arr[1] === 't';
                    }
                    else 
                        parameters[i].boolean[x] = [];
                }
                for (let x in parameters[i].string) {
                    if (parameters[i].string[x]) {
                        arr = parameters[i].string[x].slice(1).split(':');
                        if (arr.length)
                            parameters[i].string[arr[0]] = arr[1].replace(/'/g, ``).replace(/"/g, ``);
                    }
                    else
                        parameters[i].string[x] = [];
                }
                for (let x in parameters[i].integer) {
                    if (parameters[i].integer[x]) {
                        arr = parameters[i].integer[x].slice(1).split(':');
                        if (arr.length)
                            parameters[i].integer[arr[0]] = Number(arr[1]);
                    }
                    else
                        parameters[i].integer[x] = [];
                }
                for (let x in parameters[i].double) {
                    if (parameters[i].double[x]) {
                        arr = parameters[i].double[x].slice(1).split(':');
                        if (arr.length)
                            parameters[i].double[arr[0]] = Number(arr[1]);
                    }
                    else
                        parameters[i].double[x] = [];
                }
            }

            for (let i in non_passTo_arr) {
                content = non_passTo_arr[i].trim();
                commands.push(content.match(commandRegex)[0])
                let args = content.split(' ').slice(1);    
                arguments.push(args);           
            }

            for (let c in commands) {
                commands[c] = commands[c].slice(1);
            }

            const data = {
                commands,
                arguments,
                flags,
                parameters,
                urls,
                mentions,
                outputVariables
            }

            console.log(data);
            console.log(arguments)

            resolve(data);
        }
    });
}

module.exports = function (client, message) {
    return new Promise((resolve, reject) => {
        adapter.sql.server.general.getPrefix(message.guild.id)
            .then(prefix => {
                let commandParts = message.content.split(/\|/g);

                let results = [];
                let data = [];

                for (let a in commandParts)
                    data.push(getData(message, prefix, commandParts[a].trim()));

                Promise.all(data)
                    .then(data => {
                        console.log('Data\n', data);
                        let commandReturns = [];
                        for (let d in data) {
                            commandReturns.push(parseCommands(client, message, data[d]));
                        }

                        console.log('Command returns: \n', commandReturns);
                        // for (let a in data)
                        //     results.push(parseCommand(client, message, data[a]));

                        // Promise.all(results)
                        //     .then(values => {
                        //         console.log("Values\n", values);

                        //         let arr = [];

                        //         for (let i in values)
                        //             arr.push(formatResponse(values[i]));
                                
                        //         Promise.all(arr)                                
                        //             .then(responses => {
                        //                 // console.log('Responses\n', responses);

                        //                 for (let i in responses) {
                        //                     // console.log(i, responses[i]);

                        //                     for (let x in responses[i].values) {
                        //                         if (responses[i].values[x]) {
                        //                             message.channel.send(responses[i].values[x].value)
                        //                                 .then(msg => {
                        //                                     if (responses[i].options && responses[i].options.clear)
                        //                                         setTimeout(() => msg.delete(), responses[i].options.clear * 1000);
                        //                                 })
                        //                                 .catch(e => reject(e));
                        //                         }
                        //                     }

                        //                     if (responses[i].result.data.parameters.boolean['debug'])
                        //                         message.channel.send(adapter.common.debug(responses[i].result.data, false));

                        //                     if (responses[i].result.properties.selfClear && !responses[i].result.data.flags['C']) {
                        //                         if (responses[i].options && responses[i].options.clear_command)
                        //                             setTimeout(() => message.delete().catch(e => console.log('Message was already deleted.')), responses[i].options.clear_command * 1000);
                        //                         else
                        //                             message.delete();
                        //                     }
                        //                 }

                        //                 resolve(responses);
                        //             })
                        //             .catch(e => reject(e))
                        //     })
                        //     .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}