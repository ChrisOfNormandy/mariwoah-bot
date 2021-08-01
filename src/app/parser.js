const MessageData = require('./objects/MessageData');

const cmdList = require('./commands');

module.exports = (client, message, prefix, devEnabled) => {
    if (message.content.indexOf(prefix) == 0 && message.content[1] !== prefix) {
        let data = new MessageData(client, message, prefix, devEnabled);
        
        const f = cmdList.getList().filter((cmd) => { 
            if (!cmd.getRegex().command)
                return;
            return new RegExp('~(' + cmd.getRegex().command.source + ')').test(message.content); 
        });

        let cmdIndex = 0;
        let finished = false;
        let finErr = "";

        while (!finished && cmdIndex < f.length) {
            const regex = f[cmdIndex].getRegex();

            let r = `${prefix}(${regex.command.source})`;
            let scRegX = '';

            if (data.hasData) {
                // If the command has listed subcommands.
                if (!!f[cmdIndex].subcommands.size) {
                    scRegX = `${Array.from(f[cmdIndex].subcommands.keys()).map(sc => { return `(\\s(${sc}))`; }).join('|')}`;
                    r += scRegX;
                }
                else {
                    if (!!regex.arguments)
                        r += `(${regex.arguments.source})${!!regex.argsOptional ? '?' : ''}`;
                }
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
                if (data.hasData) {
                    let sc = null;
                    if (!!f[cmdIndex].subcommands.size) {
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
                            f[cmdIndex].getRegex().argumentIndexes.forEach(v => {
                                if (!!match[v])
                                    argList.push(match[v]);
                            });
                            data.setArguments(...argList);
                        }
                    }
                    else if (!!f[cmdIndex].subcommands.size) {
                        let argRegX = f[cmdIndex].getSubcommand(data.subcommand).getRegex().arguments;

                        if (!!argRegX) {
                            let match = str.match(argRegX);

                            if (match === null) {
                                if (!f[cmdIndex].getSubcommand(data.subcommand).getRegex().argsOptional) {
                                    message.channel.send('Missing arguments.');
                                    return Promise.reject(null);
                                }
                            }
                            else
                                f[cmdIndex].getSubcommand(data.subcommand).getRegex().argumentIndexes.forEach(v => { if (!!match[v]) data.arguments.push(match[v]); });
                        }
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
                            response.getContent().forEach(msg => {
                                message.channel.send(msg)
                                    .then(msg => {
                                        if (response.options.has('clear'))
                                            setTimeout(() => msg.delete().catch(err => reject(err)), response.options.get('clear').delay * 1000);

                                        if (!!f[cmdIndex].settings.size) {
                                            if (f[cmdIndex].settings.has('responseClear'))
                                                setTimeout(() => msg.delete().catch(err => reject(err)), f[cmdIndex].settings.get('responseClear').delay * 1000);

                                            if (f[cmdIndex].settings.get('commandClear'))
                                                setTimeout(() => {
                                                    message.delete()
                                                        .catch(() => {
                                                            message.channel.send('Could not clear command automatically - missing permissions.')
                                                                .then(msg => setTimeout(() => msg.delete().catch(err => reject(err)), 10 * 1000))
                                                                .catch(err => reject(err));
                                                        });
                                                }, f[cmdIndex].settings.get('commandClear').delay * 1000);
                                        }

                                        resolve(response);
                                    })
                                    .catch(err => reject(err));
                            });
                        })
                        .catch(err => {
                            err.getContent().forEach(msg => {
                                if (!!msg)
                                    message.channel.send(msg);
                            });
                            if (devEnabled)
                                reject(err.getErrors());
                            else
                                reject(null);
                        });
                });
            }
        }

        if (!finished)
            return Promise.reject('Fin. Error: ' + finErr);
    }

    return Promise.reject(null);
};