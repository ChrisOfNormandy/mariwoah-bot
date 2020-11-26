const config = require('../../private/config');
const adapter = require('../app/adapter');
const commands = require('./commands');
const getOptions = require('../app/common/bot/helpers/global/dataToOptionObject');

const Permission = require('./permission');
const Properties = require('./properties');
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

const _ = require('./functions');
function execute(str) {
    console.log('EXECUTING: ', str);
    const groups = str.match(Regex.functions._);

    const func = groups[1];
    const sub_func = groups[2] ? groups[3] : null;
    let args = groups[4];

    console.log('args: ', args);
    let s = args.match(Regex.functions[func + '_']);
    while (s !== null) {
        args = args.replace(s[0], execute(s[0]));
        s = args.match(Regex.functions[func + '_']);
    }

    console.log('new args: ', args);

    return sub_func
        ? _[func][sub_func](args)
        : _[func](args);
}

module.exports = {
    chat: (client, message) => {
        return new Promise((resolve, reject) => {
            getPrefix(message.guild.id)
                .then(prefix => {
                    if (message.content[0] == prefix || message.content[0] == config.settings.prefix) {
                        let lines = message.content.split(Regex.new_line);
                        console.log(lines);

                        for (let line in lines) {
                            console.log('Line: ', lines[line]);
                            
                            let str = lines[line];
                            while(Regex.functions._.test(str)) {
                                const groups = str.match(Regex.functions._);
                                let val = execute(str);
                                message.channel.send(val);
                                str = '';
                            }
                        }
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