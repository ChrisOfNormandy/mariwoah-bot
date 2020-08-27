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
                            verify(message, properties, data, command)
                                .then(r => resolve({
                                    command: cmd,
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
                        command,
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

function execute_command(client, message, data) {

    console.log('COMMAND > ', data.command, data.arguments)
    
    /*
        Commands should return:
        {
            values: [],
            content: [],
            *options: {}
        }
    */

    switch (data.command) {
        case 'help': return adapter.common.bot.features.listHelp(message, data.arguments);
        case 'clean': return adapter.common.bot.features.cleanChat(message);
        case 'ping': return adapter.common.bot.features.ping(message, client);
        case 'roll': return adapter.common.bot.features.roll(data.arguments);
        case 'shuffle': {
            return new Promise((resolve, reject) => {
                adapter.common.bot.global.shuffle(data.arguments[0].split(','))
                    .then(arr => resolve({values: arr, content: [arr.join(', ')]}))
                    .catch(e => reject({rejections: [e], content: []}));
            });
        }
        case 'whoami': return adapter.common.bot.features.whoAre.self(message);
        case 'whoareyou': return adapter.common.bot.features.whoAre.member(message);
        case 'setmotd': return (data.flags['r'])
                ? adapter.common.bot.features.motd.set(message, "First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://google.com/")
                : adapter.common.bot.features.motd.set(message, data.arguments.join(' '));
        case 'motd': return adapter.common.bot.features.motd.get(message, data.parameters);
        case 'setprefix': return adapter.common.bot.features.prefix.set(message, data.arguments[0]);
        case 'prefix': return adapter.common.bot.features.prefix.get(message);

        // RoleManager

        case 'warn': return adapter.punishments.warn.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data);
        case 'warnings': return adapter.punishments.warn.printAll(message, data.mentions.members.first().id);
        case 'kick': return adapter.punishments.kick.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
        case 'kicks': return adapter.punishments.kick.printAll(message, data.mentions.members.first().id);
        case 'ban': return adapter.punishments.ban.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
        case 'bans': return adapter.punishments.ban.printAll(message, data.mentions.members.first().id);
        case 'unban': return new Promise((resolve, reject) => {
                message.guild.members.unban(data.arguments[0])
                    .then(user => {
                        user.send(`You have been unbanned from ${message.guild.name}.`);
                        resolve({
                            value: `Unbanned ${user.username}.`
                        });
                    })
                    .catch(e => reject(`Cannot unban user.\n${e.message}`));
            });
        case 'promote': return adapter.rolemanagement.setPermission.promote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
        case 'demote': return adapter.rolemanagement.setPermission.demote(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0], data.arguments[1]);
        case 'setbotadmin': return adapter.rolemanagement.setRank.admin(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        case 'setbotmod': return adapter.rolemanagement.setRank.moderator(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        case 'setbothelper': return adapter.rolemanagement.setRank.helper(message, (data.mentions.members.first()) ? data.mentions.members.first().id : data.arguments[0]);
        case 'refreshrole': return adapter.rolemanagement.setRoles.refresh_user(message, message.mentions.members.first() || message.member);
        case 'refreshroles': return adapter.rolemanagement.setRoles.refresh_guild(message);
        case 'resetroles': return adapter.rolemanagement.setRoles.reset_guild(message);
        case 'purgeroles': return adapter.rolemanagement.setRoles.purge(message);
        case 'setrole': return adapter.rolemanagement.setRoles.setRole(message, data.arguments[0], message.mentions.roles.first());
        case 'timeout': {
            switch (data.arguments[0]) {
                case 'roles': {
                    value = adapter.sql.server.timeouts.toMessage(message);
                    break;
                }
            }
            break;
        }

        // Guilds

        case 'guild_admin': {
            switch (data.arguments[0]) {
                case 'refresh': return adapter.rolemanagement.guilds.update(message, data);
                case 'other_join': return adapter.rolemanagement.guilds.admin_join(message, data);
                case 'other_leave': return adapter.rolemanagement.guilds.admin_leave(message, data);
                case 'disband': return adapter.rolemanagement.guilds.admin_disband(message, data);
            }
            break;
        }
        case 'guild': {
            switch (data.arguments[0]) {
                case 'create': return adapter.rolemanagement.guilds.newCandidate(message, data);
                case 'seticon': return adapter.rolemanagement.guilds.setIcon(message, data);
                case 'setcolor': return adapter.rolemanagement.guilds.setColor(message, data);
                case 'setlore': return adapter.rolemanagement.guilds.setLore(message, data);
                case 'setmotto': return adapter.rolemanagement.guilds.setMotto(message, data);
                case 'lore': return adapter.rolemanagement.guilds.getLore(message, data);
                case 'list': return adapter.rolemanagement.guilds.list(message, data);
                case 'join': return adapter.rolemanagement.guilds.join(message, data);
                case 'leave': return adapter.rolemanagement.guilds.leave(message, data);
                case 'invite': return adapter.rolemanagement.guilds.invite(message, data);  
                case 'toggle': return adapter.rolemanagement.guilds.toggleInvites(message, data);            
                case 'invites': return adapter.rolemanagement.guilds.getInvites(message, data);              
                case 'deny': return adapter.rolemanagement.guilds.deleteInvite(message, data);                
                case 'setofficer': return adapter.rolemanagement.guilds.promote(message, data, 'officer');        
                case 'setleader': return adapter.rolemanagement.guilds.promote(message, data, 'leader');            
                case 'setmember': return adapter.rolemanagement.guilds.promote(message, data, 'member');             
                case 'exhile': return adapter.rolemanagement.guilds.promote(message, data, 'exhiled');                
                case 'settitle': return adapter.rolemanagement.guilds.setTitle(message, data);               
                case 'help': return adapter.rolemanagement.guilds.listHelp(message, data);               
                default: return adapter.rolemanagement.guilds.view(message, data);                 
            }
        }

        // Minigames

        case 'stats': {
            switch (data.arguments[0]) {
                case 'fishing': return adapter.minigames.stats.fishing(message);
                default: return adapter.minigames.stats.all(message);
            }
        }
        case 'cast': return adapter.minigames.fishing.cast(message);
        case 'inventory': return adapter.minigames.inventory.find(message, data);

        // Music

        case 'play': return adapter.music.append.fetch(message, data);
        case 'join': return adapter.music.join(message);
        case 'leave': return adapter.music.leave(message);
        case 'skip': return adapter.music.skip(message);
        case 'stop': return adapter.music.stop(message);
        case 'queue': return adapter.music.list(message, data);
        case 'pause': return adapter.music.pause(message);
        case 'resume': return adapter.music.resume(message);
        case 'songinfo': return adapter.music.info(message, data);

        case 'playlist': return adapter.music.playlistCommand(message, data);

        // Memes

        case 'f': return adapter.memes.memeDispatch('f');
        case 'fuck': return adapter.memes.memeDispatch('fuuu');
        case 'yey': return adapter.memes.memeDispatch('yey');
        case 'thowonk': return adapter.memes.memeDispatch('thowonk');
        case 'penguin': return adapter.memes.memeDispatch('penguin');
        case 'bird': return adapter.memes.memeDispatch('bird');
        case 'clayhead': return adapter.memes.memeDispatch('clayhead');
        case 'extrathicc': return adapter.memes.memeDispatch('extra_thicc');
        case 'crabrave': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM');
        case 'theriddle': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI');

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

        default: return {values: [], content: []}
    }
}

function parseCommands(client, message, dataObject) {
    console.log(dataObject);
    let returns = [];

    const data_array = dataObject.data_array;
    const outputVariables = dataObject.outputVariables;

    return new Promise((resolve, reject) => {
        let properties = null;
        let verifications = [];

        for (let i in data_array) {
            properties = getCommon(data_array[i].command)
            || getRoleManager(data_array[i].command)
            || getMusic(data_array[i].command)
            || getMinigames(data_array[i].command)
            || getMeme(data_array[i].command)
            || getOther(data_array[i].command, data_array[i].arguments);

            returns[i] = {
                properties,
                hasPermission: false,
                value: []
            };

            verifications.push(verify(message, properties, data_array[i], data_array[i].command));
        }

        Promise.all(verifications)
            .then(verifications_results => {
                let output_returns = [];

                for (let i in verifications_results) {
                    const data = data_array[i];
                    // console.log(data);

                    data.command = verifications_results[i].command;
                    returns[i].properties = verifications_results[i].properties;
                    returns[i].hasPermission = verifications_results[i].permission.state;
                    
                    console.log(i, returns[i]);

                    if (returns[i].hasPermission) {
                        output_returns.push(execute_command(client, message, data));

                        for (let val in outputVariables.cache) {
                            console.log(val, outputVariables.cache[val]);

                            if (outputVariables.cache[val].index == i) {
                                outputVariables.cache[val].value = output_returns[i].values;
                                console.log(val, outputVariables.cache[val]);

                                for (let ind in data_array) {
                                    for (let arg in data_array[ind].arguments) {
                                        console.log(data_array[ind].arguments, arg, data_array[ind].arguments[arg]);

                                        let reg_ind = data_array[ind].arguments[arg].toString().match(new RegExp(`{${val}(:\\d+)?}`));
                                        let arg_ind = 0;

                                        console.log(reg_ind);

                                        if (reg_ind && reg_ind[1]) {
                                            arg_ind = reg_ind[1].slice(1);
                                            arg_ind = (arg_ind >= outputVariables.cache[val].value.length) ? 0 : Number(arg_ind);
                                            console.log('ARG_IND: ', arg_ind)
                                        }
                                        if (new RegExp(`{${val}(:\\d+)?}`).test(data_array[ind].arguments[arg])) {
                                            console.log('VALUE: ', outputVariables.cache[val].value, outputVariables.cache[val].value[arg_ind]);
                                            data_array[ind].arguments[arg] = outputVariables.cache[val].value[arg_ind].toString();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // No perms
                    }
                }

                // console.log(output_returns);
                // console.log(data.outputVariables);

                Promise.all(output_returns)
                    .then(outputs => {
                        let message_array = [];
                        for (let out in outputs)
                            message_array.push(formatResponse(outputs[out]));
        
                        Promise.all(message_array)
                            .then(arr => resolve({
                                dataObject,
                                values: arr
                            }))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function formatResponse(input) {
    // console.log('INPUT: ', input);
    return new Promise((resolve, reject) => {
        Promise.all(input.content)
            .then(arr => resolve(arr))
            .catch(e => reject(e));
    });
}

function pullRegex(content) {
    // console.log(content);
    
    let flags = [];
    let urls = [];
    let mentions = [];

    const flagRegex = /-[a-zA-Z]+\s*/g;
    const boolParamRegex = /\?\w+:(t|f)/g;
    const stringParamRegex = /\$\w+:".*?"/g;
    const grepParamRegex = /grep:'\/.+?\/[gimsuy]?'/g;
    const intParamRegex = /\^\w+:-?\d+/g;
    const doubleParamRegex = /%\w+:-?\d+\.\d+/g;

    let params = {
        'boolean': [],
        'string': [],
        'regex': [],
        'integer': [],
        'double': []
    }
    let parameters = {
        'boolean': {},
        'string': {},
        'regex': {},
        'integer': {},
        'double': {}
    }

    urls = content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

    params.boolean = content.match(boolParamRegex);
    content = content.replace(boolParamRegex, '');
    params.string = content.match(stringParamRegex);
    content = content.replace(stringParamRegex, '');
    params.regex = content.match(grepParamRegex);
    content = content.replace(grepParamRegex, '');
    params.integer = content.match(intParamRegex);
    content = content.replace(intParamRegex, '');
    params.double = content.match(doubleParamRegex);
    content = content.replace(doubleParamRegex, '');

    content = content.replace(/>\s\w/g, '').trim();

    if (!urls)
        urls = [];

    if (flagRegex.test(content)) {
        let flagArr = content.match(flagRegex)[0].slice(1).split('');
        for (let x in flagArr) {
            flags[flagArr[x]] = true;
        }
        content = content.replace(flagRegex, '');
    }

    for (let x in params.boolean) {
        if (params.boolean[x]) {
            arr = params.boolean[x].slice(1).split(':');
            if (arr.length)
                parameters.boolean[arr[0]] = arr[1] === 't';
        }
    }
    for (let x in params.string) {
        if (params.string[x]) {
            arr = params.string[x].slice(1).split(':');
            if (arr.length)
                parameters.string[arr[0]] = arr[1].replace(/'/g, ``).replace(/"/g, ``);
        }
    }
    for (let x in params.integer) {
        if (params.integer[x]) {
            arr = params.integer[x].slice(1).split(':');
            if (arr.length)
                parameters.integer[arr[0]] = Number(arr[1]);
        }
    }
    for (let x in params.double) {
        if (params.double[x]) {
            arr = params.double[x].slice(1).split(':');
            if (arr.length)
                parameters.double[arr[0]] = Number(arr[1]);
        }
    }

    let arguments = (content) ? content.split(' ') : [];
    if (!arguments)
        arguments = [];

    let val = {
        flags,
        parameters,
        urls,
        mentions,
        arguments
    }

    return val;
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
            let regex_arr = [];
            const passThrough = `${reg}.*\\s>\\s([a-zA-Z])`;
            const passThroughRegex = new RegExp(passThrough, '');
            const outputVariables = {
                cache: {},
                out: []
            };

            let commands = [];

            const passThrough_arr = part.split('=>');
            
            let passTo_arr = [];
            let non_passTo_arr = [];

            for (let i in passThrough_arr) {
                if (passThrough_arr[i].match(passThroughRegex) !== null)
                    passTo_arr.push(passThrough_arr[i].match(passThroughRegex));
                else
                    non_passTo_arr.push(passThrough_arr[i]);
            }

            for (let i in passTo_arr) {
                // console.log(passTo_arr[i]);
                let reg_values = pullRegex(passTo_arr[i][0].replace(new RegExp(`${reg}\\s`, 'g'), ''));
                // console.log(reg_values);

                outputVariables.cache[passTo_arr[i][1]] = {
                    index: i,
                    value: null
                };
                
                commands.push(passTo_arr[i][0].split(' >')[0].match(commandRegex)[0]);   
                regex_arr.push(reg_values);            
            }

            for (let i in non_passTo_arr) {
                content = non_passTo_arr[i].trim();
                commands.push(content.match(commandRegex)[0]);
                content = content.replace(commandRegex, '').trim();
                let reg_values = pullRegex(content);
                regex_arr.push(reg_values);
            }

            for (let c in commands) {
                commands[c] = commands[c].slice(1);
            }

            let data_array = [];
            for (let i in commands) {
                data_array.push({
                    command: commands[i],
                    arguments: regex_arr[i].arguments,
                    parameters: regex_arr[i].parameters,
                    flags: regex_arr[i].flags,
                    urls: regex_arr[i].urls
                });
            }

            // console.log(data_array);
            // console.log(arguments)

            resolve({
                data_array,
                outputVariables
            });
        }
    });
}

module.exports = function (client, message) {
    return new Promise((resolve, reject) => {
        adapter.sql.server.general.getPrefix(message.guild.id)
            .then(prefix => {
                let commandParts = message.content.split(/\|/g);

                let data = [];

                for (let a in commandParts)
                    data.push(getData(message, prefix, commandParts[a].trim()));

                Promise.all(data)
                    .then(data => {
                        // console.log('Data\n', data);
                        let commandReturns = [];
                        for (let i in data)
                            commandReturns.push(parseCommands(client, message, data[i]));
                        
                        Promise.all(commandReturns)
                            .then(returns => {
                                // console.log('Returns:\n', returns);

                                for (let i in returns) {
                                    console.log(returns[i]);
                                    for (let x in returns[i].values) {
                                        for (let l in returns[i].values[x])
                                            message.channel.send(returns[i].values[x][l]);
                                    }
                                }
                            })
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}