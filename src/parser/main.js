const Discord = require('discord.js');

const config = require('../../private/config');
const adapter = require('../app/adapter');
const commands = require('./commands');
const getOptions = require('../app/common/bot/helpers/global/dataToOptionObject');

const Permission = require('./permission');
const Data = require('./data');
const Regex = require('./regex');

function execute_command(message, data) {
    let value = data.properties.run(message, data);
    return new Promise((resolve, reject) => {
        try {
            value
                .then(res => resolve(res))
                .catch(err => reject(err));
        }
        catch (e) {
            resolve(value);
        }
    });
}

function parseCommands(client, message, dataObject) {
    let returns = [];

    const data_array = dataObject.data_array;
    const outputVariables = dataObject.outputVariables;

    return new Promise((resolve, reject) => {
        let properties = null;
        let verifications = [];

        for (let i in data_array) {
            properties = Properties.get(data_array[i].command);
            if (properties === null || !properties.enabled)
                continue;

            returns[i] = {
                properties,
                hasPermission: false,
                value: []
            };

            verifications.push(Permission.verify(message, properties, data_array[i], data_array[i].command));
        }

        Promise.all(verifications)
            .then(verifications_results => {
                let output_returns = [];

                for (let i in verifications_results) {
                    const data = data_array[i];
                    data.client = client;

                    data.properties = verifications_results[i].properties;

                    data.mentions.members.forEach((v, k, m) => {
                        data.mentions.members.set(k, message.guild.members.cache.get(k));
                    });
                    data.mentions.roles.forEach((v, k, m) => {
                        data.mentions.roles.set(k, message.guild.roles.cache.get(k));
                    });

                    returns[i].properties = verifications_results[i].properties;
                    returns[i].hasPermission = verifications_results[i].permission.state;
                    
                    if (returns[i].hasPermission) {
                        output_returns.push(execute_command(message, data));

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

function getPrefix(guild_id) {
    return new Promise((resolve, reject) => {
        adapter.sql.server.general.getPrefix(guild_id)
            .then(prefix => resolve(prefix))
            .catch(err => reject(err));
    });
}

const _f = require('./functions');
const _v = require('./variables');
const _c = require('./conditions');

function setVars(str) {
    const groups = str.match(Regex.variables._);
    return groups[3]
        ? _v['_' + groups[1]][groups[3]]
        : _v['_' + groups[1]];
    // groups[1] = "class"
    // groups[3] = "property"
}

async function execute(str, options) {
    const groups = str.match(Regex.functions._);
    const func = groups[1];
    const sub_func = groups[2] ? groups[3] : null;
    const flags = groups[4] ? groups[5] : [];
    let args = groups[6];

    // console.log(groups);

    args = _c(args);

    // Run through nested functions
    while (Regex.functions._.test(args)) {
        const s = args.match(Regex.functions._);
        let v = await execute(s[0], options);
        args = args.replace(s[0], v.value || v);
    }

    // Replace variables with values
    while(Regex.variables._.test(args))
        args = args.replace(args.match(Regex.variables._)[0], setVars(args));

    // Separate arguments by commas into an array
    args = args.split(Regex.csv);

    // Run function.sub_function(...[args])
    if(!!_f[func])
        return !!sub_func
            ? _f[func][sub_func].apply(null, args)
            : _f[func]._.apply(null, args);
    
    // console.log(func, sub_func, args);

    const data = {
        client: options.client,
        message: options.message,
        arguments: args,
        flags
    }

    let arr = commands.filter((o) => {return o.commands.includes(sub_func)});

    if (arr.length) {
        let v = await arr[0].run(options.message, data);
        return v.values;
    }
    else
        return `"${groups[0].slice(1)}"`;
}

async function run(str, options, skip = false) {
    let res = {
        value: str,
        embedded: []
    }
    if (skip && !Regex.special_operations._.test(res.value))
        return;

    // Execute functions
    while(Regex.functions._.test(res.value)) {
        let v = await execute(res.value, options);
        res.value = res.value.replace(res.value.match(Regex.functions._)[0], v);
    }

    // console.log('After functions: ', res);

    // Set variables
    while(Regex.variables._.test(res.value))
        res.value = res.value.replace(res.value.match(Regex.variables._)[0], setVars(res.value));

    // console.log('After variables: ', res);

    while(Regex.parentheses.test(res.value) && !Regex.parentheses_bool.test(res.value)) {
        const g = res.value.match(Regex.parentheses);
        // console.log(g);
        const r = await run(g[1]);
        const v = r.value;
        // console.log(v);
        res.value = v == 0 || v == 1
            ? res.value.replace(g[1], v)
            : res.value.replace(g[0], v);
    }

    // console.log('After parentheses:', res);

    // Evaluate conditionals - a == b, etc
    res.value = _c(res.value);

    // console.log('After conditions: ', res);

    return res
}

module.exports = {
    chat: (client, message) => {
        return new Promise((resolve, reject) => {
            getPrefix(message.guild.id)
                .then(async (prefix) => {
                    if (message.content[0] == prefix || message.content[0] == config.settings.prefix) {
                        let lines = message.content.slice(1).split(Regex.new_line);

                        let embed = new Discord.MessageEmbed().setTitle('Returned:');

                        let values = [];
                        let objects = [];

                        let startTimes = [];
                        let endTimes = [];
                        let ellapsed = 0;

                        let ops = {
                            line: 0,
                            skip: false,
                            level: 0,
                            cond: false,
                            loop: null,
                            loop_overflow: 0,
                            vars: new Map()
                        };

                        const options = {
                            client,
                            message
                        };

                        for (let line = 0; line < lines.length; line++) {
                            ops.line = line;
                            let str = lines[line];

                            startTimes[line] = Date.now();

                            const l = await run(str, options, ops.skip);

                            endTimes[line] = Date.now();
                            ellapsed += endTimes[line] - startTimes[line];

                            if (!l)
                                continue;

                            let flag = l.value.match(Regex.special_operations._);

                            if (flag !== null) {
                                // console.log(flag);
                                switch(flag[1]) {
                                    case 'if': {
                                        ops.skip = flag[3] == 0;
                                        ops.level++;
                                        ops.cond = true;
                                        break;
                                    }
                                    case 'else': {
                                        ops.skip = flag[3] === undefined
                                            ? false
                                            : flag[3] == 0;
                                        ops.cond = true;
                                        break;
                                    }
                                    case 'while': {
                                        // console.log('LOOP')
                                        if (flag[3] == 1) {
                                            if (ops.loop_overflow > 10000) {
                                                values[line] = ops.loop_overflow;
                                                ops.loop = null;
                                            }
                                            else {
                                                ops.loop = line - 1;
                                            }
                                        }
                                        else {
                                            values[line] = ops.loop_overflow || "0";
                                            ops.loop = null;
                                            ops.skip = true;
                                        }
                                        break;
                                    }
                                    case 'end': {
                                        if (ops.cond)
                                            ops.cond = false;
                                        if (ops.loop !== null) {
                                            line = ops.loop;
                                            ops.loop_overflow++;
                                            break;
                                        }
                                        ops.skip = false;
                                        ops.level--;
                                        break;
                                    }
                                }
                                // console.log(lines[line], l.value);
                                // console.log(ops);
                            }
                            else {
                                if (!ops.skip) {
                                    values[line] = l.value;
                                    objects[line] = l.embedded.length ? l.embedded : [];
                                    lines[line] = l.value;
                                }
                            }
                            // console.log(line, lines[line], l.value);
                        }

                        let field = '';
                        
                        for (let i = 0; i < values.length; i++)
                            if (!!values[i])
                                field += `**${i}** | _${endTimes[i] - startTimes[i]} ms_ | ${values[i]}\n`;

                        embed.addField('#Start', field)
                        embed.setFooter(`> Ellapsed: ${ellapsed} ms.`);

                        message.channel.send(embed);

                        for (let i in objects)
                            for (let c in objects[i])
                                message.channel.send(objects[i][c]);
                    }
                    else
                        reject(null);
                })
                .catch(err => reject(err));
        });
    },
    console: (string) => {
        return new Promise((resolve, reject) => {
            resolve(string);
        });
    }
}