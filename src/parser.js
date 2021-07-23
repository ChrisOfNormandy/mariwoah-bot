const MessageData = require('./app/objects/MessageData');

const config = require('../config/config.json');
const cmdList = require('./commands');

module.exports = (client, message) => {
    const prefix = config.settings.commands.prefix;

    if (message.content.indexOf(prefix) == 0 && message.content[1] !== prefix) {
        const input = message.content;

        let data = new MessageData(client, message);

        const f = cmdList.filter((cmd) => {
            const regex = new RegExp('~(' + cmd.regex.command.source + ')');
            return regex.test(input);
        });

        let cmdIndex = 0;
        let finished = false;
        let finErr = "";

        while (!finished && cmdIndex < f.length) {
            const regex = f[cmdIndex].regex;

            let r = `${prefix}(${regex.command.source})`;
            let scRegX = '';

            let scList = {};

            // If the command has listed subcommands.
            if (!!f[cmdIndex].subcommands) {
                f[cmdIndex].subcommands.forEach((sc, i) => {
                    scRegX += '(';

                    scRegX += `\\s(${sc.name})`;

                    scRegX += `)${i < f[cmdIndex].subcommands.length - 1 ? '|' : ''}`;

                    r += scRegX;

                    scList[sc.name] = i;
                });
            }
            else {
                if (!!regex.arguments)
                    r += `(${regex.arguments.source})${!!regex.argsOptional ? '?' : ''}`;
            }

            let rx = new RegExp(r);

            if (!rx.test(data.content)) {
                finErr = `Failed test: ${rx}, ${data.content}`;
                cmdIndex++;
                continue;
            }
            else {
                // Remove prefix.
                let str = data.content.slice(1);

                // Fetch and remove command.
                const c = str.match(regex.command);
                str = str.replace(c[0], '');
                data.setCommand(c[0]);

                // Fetch and remove subcommand.
                let sc = null;
                if (!!f[cmdIndex].subcommands) {
                    sc = str.match(new RegExp(scRegX));

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
                        if (!f[cmdIndex].regex.argsOptional) {
                            message.channel.send('Missing arguments.');
                            return Promise.reject(null);
                        }
                    }
                    else {
                        str = str.replace(args[0], '');
                        let argList = [];
                        f[cmdIndex].regex.argumentIndexes.forEach(v => { 
                            if (!!match[v]) 
                                argList.push(match[v]); 
                        });
                        data.setArguments(...argList);
                    }
                }
                else if (!!f[cmdIndex].subcommands) {
                    let argRegX = f[cmdIndex].subcommands[scList[data.subcommand]].regex.arguments;

                    if (!!argRegX) {

                        let match = str.match(argRegX);

                        if (match === null) {
                            if (!f[cmdIndex].subcommands[scList[data.subcommand]].regex.argsOptional) {
                                message.channel.send('Missing arguments.');
                                return Promise.reject(null);
                            }
                        }
                        else
                            f[cmdIndex].subcommands[scList[data.subcommand]].regex.argumentIndexes.forEach(v => { if (!!match[v]) data.arguments.push(match[v]); });
                    }
                }

                finished = true;

                if (!f[cmdIndex].enabled)
                    return Promise.reject(null);

                if (!!f[cmdIndex].adminOnly && !data.admin)
                    return Promise.reject(null);

                return new Promise((resolve, reject) => {
                    f[cmdIndex].run(message, data)
                        .then(response => {
                            response.content.forEach(msg => {
                                message.channel.send(msg)
                                    .then(msg => {
                                        if (!!response.options && !!response.options.clear)
                                            setTimeout(() => { msg.delete().catch(err => reject(err)); }, response.options.clear * 1000);

                                        if (!!f[cmdIndex].settings) {
                                            if (!!f[cmdIndex].settings.responseClear)
                                                setTimeout(() => { msg.delete().catch(err => reject(err)); }, f[cmdIndex].settings.responseClear.delay * 1000);

                                            if (!!f[cmdIndex].settings.commandClear) {
                                                setTimeout(() => {
                                                    message.delete()
                                                        .catch(() => {
                                                            message.channel.send('Could not clear command automatically - missing permissions.')
                                                                .then(msg => setTimeout(() => msg.delete().catch(err => reject(err)), 10 * 1000))
                                                                .catch(err => reject(err));
                                                        });
                                                }, f[cmdIndex].settings.commandClear.delay * 1000);
                                            }
                                        }
                                    })
                                    .catch(err => reject(err));
                            });
                        })
                        .catch(err => {
                            console.error('Parser | ERROR:', err);

                            if (!!err.content)
                                err.content.forEach(msg => {
                                    if (!!msg)
                                        message.channel.send(msg);
                                });

                            reject(err.rejections[0]);
                        });
                });
            }
        }
        
        if (!finished)
            return Promise.reject('Fin. Error: ' + finErr);
    }

    return Promise.reject(null);
};