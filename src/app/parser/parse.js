const Output = require('../objects/Output');
const MessageData = require('../objects/MessageData');

const commands = require('../commands');

/**
 * 
 * @param {Discord.Client} client 
 * @param {string} content 
 * @param {string} prefix 
 * @param {Discord.Message} message 
 * @param {Output} ingest
 * @param {MessageData} ingestData
 * @returns {Promise<Output>}
 */
function parseString(client, content, prefix, message, ingest = undefined, ingestData = undefined) {
    const validCommands = commands.getList().filter((cmd) =>
        !!cmd.getRegex().command &&
        new RegExp(`${prefix}(${cmd.getRegex().command.source})`).test(content)
    );

    if (!validCommands.length)
        return Promise.reject(new Output().setOption('output', false).setError(new Error('Valid commands length was 0.')));

    let index = 0, finished = false;

    let data = new MessageData(client, content, message.member, prefix, ingest, ingestData);

    let regex, commandStringRegex, subCommandRegex, str;

    while (!finished && index < validCommands.length) {
        regex = validCommands[index].getRegex();

        commandStringRegex = `${prefix}(${regex.command.source})`;
        subCommandRegex = '';

        if (data.hasData) {
            if (validCommands[index].subcommands.size) {
                subCommandRegex = `${Array.from(validCommands[index].subcommands.keys()).map((sc) => { return `(\\s(${sc}))`; }).join('|')}`;
                commandStringRegex += subCommandRegex;
            }
            else {
                if (regex.arguments)
                    commandStringRegex += `(${regex.arguments.source})${regex.argsOptional
                        ? '?'
                        : ''
                        }`;
            }
        }

        let commandRegex = new RegExp(commandStringRegex);

        if (!commandRegex.test(data.content)) {
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

                if (validCommands[index].subcommands.size) {
                    sc = str.match(new RegExp(subCommandRegex));

                    if (sc !== null) {
                        str = str.replace(sc[0], '');
                        data.setSubcommand(
                            sc.filter((x) => { return x !== undefined && x !== sc[0]; })[0]
                        );
                    }
                }

                // Fetch and remove arguments.
                let args = [];
                if (regex.arguments) {
                    let match = str.match(regex.arguments);

                    if (match === null) {
                        if (!validCommands[index].regex.argsOptional) {
                            return Promise.reject(new Output().setError(new Error('Missing arguments.')));
                        }
                    }
                    else {
                        str = str.replace(args[0], '');
                        let argList = [];
                        validCommands[index].getRegex().argumentIndexes.forEach((v) => {
                            if (match[v])
                                argList.push(match[v]);
                        });
                        data.setArguments(...argList);
                    }
                }
                else if (validCommands[index].subcommands.size) {
                    let argRegX = validCommands[index].getSubcommand(data.subcommand).getRegex().arguments;

                    if (argRegX) {
                        let match = str.match(argRegX);

                        if (match === null) {
                            if (!validCommands[index].getSubcommand(data.subcommand).getRegex().argsOptional) {
                                return Promise.reject(new Output().setError(new Error('Missing arguments.')));
                            }
                        }
                        else
                            validCommands[index].getSubcommand(data.subcommand).getRegex().argumentIndexes.forEach((v) => { if (match[v]) data.arguments.push(match[v]); });
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
                    .then((response) => {
                        data.outputs.forEach((v) => data.vars.set(v, response.values[0]));

                        if (data.pipedCommand !== null) {
                            parseString(client, data.pipedCommand, prefix, message, response, data)
                                .then((response) => resolve(response))
                                .catch((err) => reject(err));
                        }
                        else
                            resolve(response);
                    })
                    .catch((err) => reject(err));
            });
        }
    }

    return Promise.reject(new Output().setOption('output', false).setError(new Error('Failed to parse.')));
}

/**
 * 
 * @param {Error} err 
 * @param {Message} message 
 * @param {*} options 
 * @param {function} reject 
 */
function onParseError(err, message, options, reject) {
    if (err.error === null) {
        err.getContent().forEach((msg) => {
            if (msg)
                message.channel.send(msg);
        });

        if (options.devEnabled)
            reject(err.getErrors());
        else
            reject(null);
    }
    else {
        try {
            if (err.options.has('output') && err.options.get('output')) {
                err.getContent().forEach((msg) => {
                    if (msg)
                        message.channel.send(msg);
                });

                if (options.devEnabled)
                    reject(err.getErrors());
                else
                    reject(null);
            }
            else if (options.devEnabled)
                console.error(err);
        }
        catch (e) {
            console.error(err);
            reject(err);
        }
    }
}

/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {string} prefix
 * @param {{devEnabled: boolean}} options
 * @returns {Promise<Output>}
 */
function parse(client, message, prefix, options) {
    const prefixCheck = new RegExp(`^${prefix}`);

    if (!prefixCheck.test(message.content))
        return Promise.reject(null);

    return new Promise((resolve, reject) => {
        parseString(client, message.content, prefix, message)
            .then((response) => {
                console.log('RESPONSE:', response);

                response.getContent().forEach((msg) => {
                    message.channel.send(msg)
                        .then((msg) => {
                            if (response.options.has('clear'))
                                setTimeout(() => msg.delete().catch((err) => reject(err)), response.options.get('clear').delay * 1000);

                            resolve(response);
                        })
                        .catch((err) => reject(err));
                });
            })
            .catch((err) => {
                console.log('FAILED TO PARSE COMMAND.');
                console.error(err);

                if (err !== null)
                    onParseError(err, message, options, reject);
            });
    });
}

module.exports = parse;
