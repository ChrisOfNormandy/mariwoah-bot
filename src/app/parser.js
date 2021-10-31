const Discord = require('discord.js');
const MessageData = require('./objects/MessageData');
const Output = require('./objects/Output');

const cmdList = require('./commands');

/**
 * 
 * @param {*} client 
 * @param {*} content 
 * @param {*} prefix 
 * @param {*} message 
 * @returns {Promise<Output>}
 */
function parseString(client, content, prefix, message, ingest = undefined, ingestData = undefined) {
    const validCommands = cmdList.getList().filter((cmd) =>
        !!cmd.getRegex().command &&
        new RegExp(`${prefix}(${cmd.getRegex().command.source})`).test(content)
    );

    if (!validCommands.length) {
        if (new RegExp(`${prefix}:`).test(content)) {
            let data = new MessageData(client, content, message.member, prefix, ingest, ingestData);
            return Promise.resolve(new Output('Yes.'));
        }
        
        return Promise.reject(new Output().setOption('output', false).setError(new Error('Valid commands length was 0.')));
    }

    let index = 0, finished = false;

    let data = new MessageData(client, content, message.member, prefix, ingest, ingestData);

    let regex, commandStringRegex, subCommandRegex, str;
    while (!finished && index < validCommands.length) {
        regex = validCommands[index].getRegex();

        commandStringRegex = `${prefix}(${regex.command.source})`;
        subCommandRegex = "";

        if (data.hasData) {
            if (!!validCommands[index].subcommands.size) {
                subCommandRegex = `${Array.from(validCommands[index].subcommands.keys()).map(sc => { return `(\\s(${sc}))`; }).join('|')}`;
                commandStringRegex += subCommandRegex;
            }
            else {
                if (!!regex.arguments)
                    commandStringRegex += `(${regex.arguments.source})${!!regex.argsOptional ? '?' : ''}`;
            }
        }

        let commandRegex = new RegExp(commandStringRegex);

        if (!commandRegex.test(data.content)) {
            finErr = `Failed test: ${commandRegex}, ${data.content}`;
            index++;
            continue;
        }
        else {
            // Remove prefix.
            str = data.content.slice(1);

            // Fetch and remove command.
            const c = str.match(regex.command);
            str = str.replace(c[0], '');
            data.setCommand(c[0]);

            // Fetch and remove subcommand.
            if (data.hasData) {
                let sc = null;

                if (!!validCommands[index].subcommands.size) {
                    sc = str.match(new RegExp(subCommandRegex));

                    if (sc !== null) {
                        str = str.replace(sc[0], '');
                        data.setSubcommand(
                            sc.filter((x) => { return x !== undefined && x != sc[0]; })[0]
                        );
                    }
                }

                // Fetch and remove arguments.
                let args = [];
                if (!!regex.arguments) {
                    let match = str.match(regex.arguments);

                    if (match === null) {
                        if (!validCommands[index].regex.argsOptional) {
                            return Promise.reject(new Output().setError(new Error('Missing arguments.')));
                        }
                    }
                    else {
                        str = str.replace(args[0], '');
                        let argList = [];
                        validCommands[index].getRegex().argumentIndexes.forEach(v => {
                            if (!!match[v])
                                argList.push(match[v]);
                        });
                        data.setArguments(...argList);
                    }
                }
                else if (!!validCommands[index].subcommands.size) {
                    let argRegX = validCommands[index].getSubcommand(data.subcommand).getRegex().arguments;

                    if (!!argRegX) {
                        let match = str.match(argRegX);

                        if (match === null) {
                            if (!validCommands[index].getSubcommand(data.subcommand).getRegex().argsOptional) {
                                return Promise.reject(new Output().setError(new Error('Missing arguments.')));
                            }
                        }
                        else
                            validCommands[index].getSubcommand(data.subcommand).getRegex().argumentIndexes.forEach(v => { if (!!match[v]) data.arguments.push(match[v]); });
                    }
                }
            }

            finished = true;

            if (!validCommands[index].enabled)
                return Promise.reject(new Output().setOption('output', false).setError(new Error('Command not enabled.')));

            if (!!validCommands[index].adminOnly && !data.admin)
                return Promise.reject(new Output().setOption('output', false).setError(new Error('User lacks admin permissions.')));

            return new Promise((resolve, reject) => {
                validCommands[index].run(message, data)
                    .then(response => {
                        data.outputs.forEach(v => data.vars.set(v, response.values[0]));

                        if (data.pipedCommand !== null) {
                            parseString(client, data.pipedCommand, prefix, message, response, data)
                                .then(response => resolve(response))
                                .catch(err => reject(err));
                        }
                        else
                            resolve(response);
                    })
                    .catch(err => reject(err));
            });
        }
    }

    return Promise.reject(new Output().setOption('output', false).setError(new Error('Failed to parse.')));
}

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} prefix
 * @param {boolean} devEnabled
 * @returns {Promise<*>}
 */
function parse(client, message, prefix, devEnabled) {
    if (message.content.indexOf(prefix) == 0 && message.content[1] !== prefix)
        return new Promise((resolve, reject) => {
            parseString(client, message.content, prefix, message)
                .then(response => {
                    response.getContent().forEach(msg => {
                        message.channel.send(msg)
                            .then(msg => {
                                if (response.options.has('clear'))
                                    setTimeout(() => msg.delete().catch(err => reject(err)), response.options.get('clear').delay * 1000);

                                resolve(response);
                            })
                            .catch(err => reject(err));
                    });
                })
                .catch(err => {
                    if (err !== null) {
                        try {
                            if (err.options.has('output') && err.options.get('output')) {
                                err.getContent().forEach(msg => {
                                    if (!!msg)
                                        message.channel.send(msg);
                                });

                                if (devEnabled)
                                    reject(err.getErrors());
                                else
                                    reject(null);
                            }
                            else if (devEnabled)
                                console.error(err);
                        }
                        catch (e) {
                            console.error(e);
                            reject(e);
                        }
                    }
                });
        });

    return Promise.reject(null);
}

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {string} prefix 
 * @param {boolean} devEnabled 
 * @returns {Promise<*>}
 */
module.exports = parse;