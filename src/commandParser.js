const config = require('../private/config');
const adapter = require('./app/adapter');
const commands = require('./commands');
const commandList = adapter.common.bot.global.commandList;
const getOptions = require('./app/common/bot/helpers/global/dataToOptionObject');

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
   
    /*
        Commands should return:
        {
            values: [],
            content: [],
            *options: {}
        }
    */

    return (commands[data.command])
        ? commands[data.command].run(message, data)
        : {values: [], content: [], options: {}}
}

function parseCommands(client, message, dataObject) {
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
                    data.client = client;

                    data.mentions.members.forEach((v, k, m) => {
                        data.mentions.members.set(k, message.guild.members.cache.get(k));
                    });
                    data.mentions.roles.forEach((v, k, m) => {
                        data.mentions.roles.set(k, message.guild.roles.cache.get(k));
                    });

                    data.command = verifications_results[i].command;
                    returns[i].properties = verifications_results[i].properties;
                    returns[i].hasPermission = verifications_results[i].permission.state;
                    

                    if (returns[i].hasPermission) {
                        output_returns.push(execute_command(client, message, data));

                        for (let val in outputVariables.cache) {

                            if (outputVariables.cache[val].index == i) {
                                outputVariables.cache[val].value = output_returns[i].values;

                                for (let ind in data_array) {
                                    for (let arg in data_array[ind].arguments) {

                                        let reg_ind = data_array[ind].arguments[arg].toString().match(new RegExp(`{${val}(:\\d+)?}`));
                                        let arg_ind = 0;

                                        if (reg_ind && reg_ind[1]) {
                                            arg_ind = reg_ind[1].slice(1);
                                            arg_ind = (arg_ind >= outputVariables.cache[val].value.length) ? 0 : Number(arg_ind);
                                        }
                                        if (new RegExp(`{${val}(:\\d+)?}`).test(data_array[ind].arguments[arg])) {
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
    return new Promise((resolve, reject) => {
        Promise.all(input.content)
            .then(arr => resolve({content: arr, input}))
            .catch(e => reject(e));
    });
}

function pullRegex(content) {   
    let flags = {};
    let mentions = {
        members: new Map(),
        roles: new Map()
    };

    const flagRegex = /\s-[a-zA-Z]+\s*/g;
    const boolParamRegex = /\?\w+:(t|f)/g;
    const stringParamRegex = /\$\w+:".*?"/g;
    const grepParamRegex = /grep:'\/.+?\/[gimsuy]?'/g;
    const intParamRegex = /\^\w+:-?\d+/g;
    const doubleParamRegex = /%\w+:-?\d+\.\d+/g;
    const memberRegex = /<@!\d{18}>/g;
    const roleRegex = /<@&\d{18}>/g;

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

    let urls = content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    content = content.replace(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '');

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

    const members = content.match(memberRegex);
    content = content.replace(memberRegex, '');
    for (let i in members)
        mentions.members.set(members[i].replace('<@!', '').replace('>', ''), true);

    const roles = content.match(roleRegex);
    content = content.replace(roleRegex, '');
    for (let i in roles)
        mentions.roles.set(roles[i].replace('<@&', '').replace('>', ''), true);

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
        arguments,
        mentions
    }

    return val;
}

function getData(prefix, part) {
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

        const prefixes = [prefix, config.settings.prefix];

        const reg = `[${prefixes.join('')}][a-zA-Z?]+`;
        const commandRegex = new RegExp(reg, 'g');

        if (!commandRegex.test(msgArray[0]) && !prefixes.join('').includes(msgArray[0][0])) {
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
                let reg_values = pullRegex(passTo_arr[i][0].replace(new RegExp(`${reg}\\s`, 'g'), ''));

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
                    urls: regex_arr[i].urls,
                    mentions: regex_arr[i].mentions
                });
            }

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
                    data.push(getData(prefix, commandParts[a].trim()));

                Promise.all(data)
                    .then(data => {
                        let commandReturns = [];
                        for (let i in data)
                            commandReturns.push(parseCommands(client, message, data[i]));
                        
                        Promise.all(commandReturns)
                            .then(returns => {

                                for (let i in returns) {
                                    for (let x in returns[i].values) {
                                        for (let l in returns[i].values[x].content) {
                                            message.channel.send(returns[i].values[x].content[l])
                                                .then(msg => {
                                                    let options = getOptions(returns[i].dataObject.data_array[x], returns[i].values[x].input.options)
                                                    if (options.selfClear)
                                                        msg.delete();
                                                })
                                                .catch(e => reject(e));
                                        }
                                    }
                                }

                                resolve(returns);
                            })
                            .catch(e => {
                                for (let i in e.content) {
                                    message.channel.send(e.content[i])
                                }
                            });
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}