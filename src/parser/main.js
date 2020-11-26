const adapter = require('../app/adapter');
const commands = require('./commands');
const getOptions = require('../app/common/bot/helpers/global/dataToOptionObject');

const Permission = require('./permission');
const Properties = require('./properties');
const Data = require('./data');

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

const regex = {
    new_line: /\n/g,
    then: /\.then\((\w(\s,\s\w)*\s=>\s.+)\)/g
};

module.exports = (client, message) => {
    return new Promise((resolve, reject) => {
        getPrefix(message.guild.id)
            .then(prefix => {
                if (message.content[0] != prefix)
                    reject(null);
                else {
                    let lines = message.content.split(regex.new_line);
                    console.log(lines);
                    let data_promises = [];

                    for (let line in lines) {
                        let thens = lines[line].match(regex.then);
                        let cmd = lines[line].replace(regex.then, '');

                        console.log('Command: ', cmd);
                        console.log('Thens: ', thens);

                        data_promises.push(Data.get(prefix, lines[line].trim()));
                    }

                    Promise.all(data_promises)
                        .then(data_array => {
                            let cmd_promises = [];
                            
                            for (let index in data_array) {
                                cmd_promises.push(parseCommands(client, message, data_array[index]));
                            }

                            Promise.all(cmd_promises)
                                .then(cmd_returns => {
                                    for (let ret_index in cmd_returns) {
                                        for (let val_index in cmd_returns[ret_index].values) {
                                            for (let content_index in cmd_returns[ret_index].values[val_index].content) {
                                                message.channel.send(cmd_returns[ret_index].values[val_index].content[content_index])
                                                    .then(msg => {
                                                        let options = getOptions(cmd_returns[ret_index].dataObject.data_array[val_index], cmd_returns[ret_index].values[val_index].input.options)
                                                        if (options.selfClear)
                                                            msg.delete();
                                                        let settings = commands[cmd_returns[ret_index].dataObject.data_array[val_index].command].settings;

                                                        if (settings.commandClear)
                                                            message.delete({timeout: settings.commandClear.delay * 1000})
                                                        if (settings.responseClear)
                                                            msg.delete({timeout: settings.responseClear.delay * 1000});
                                                    })
                                                    .catch(e => reject(e));
                                            }
                                        }
                                    }

                                    resolve(cmd_returns);
                                })
                                .catch(e => reject(e));
                        })
                        .catch(e => reject(e));
                    }
                })
                .catch(err => reject(err));
    });
}