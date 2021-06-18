function getData(input) {
    let str = input;

    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const flagRegex = /\s\-[a-zA-Z]+/g;
    const userMentionsRegex = /<@!\d{18}>/g;

    const mentions = input.match(userMentionsRegex);
    if (mentions !== null)
        for (let u in mentions)
            str = str.replace(mentions[u], `<USER:${u}>`);

    const urls = input.match(urlRegex);
    if (urls !== null)
        for (let url in urls)
            str = str.replace(urls[url], `<URL:${url}>`);

    const flags_ = str.match(flagRegex);
    const flags = [];

    if (flags_ !== null) {
        for (let flag in flags_) {
            str = str.replace(flags_[flag], ``);
            flags_[flag] = flags_[flag].slice(2);

            if (flags_[flag].length > 1) {
                let arr = flags_[flag].split('');
                for (let i in arr)
                    if (!flags.includes(arr[i]))
                        flags.push(arr[i]);
            }
            else
                flags.push(flags_[flag]);
        }
    }

    let parameters = {
        integer: {}
    };

    return {
        arguments: [],
        client: null,
        command: null,
        prefix: null,
        subcommand: null,
        content: str,
        urls: urls === null ? [] : urls,
        flags: flags === null ? [] : flags,
        parameters,
        mentions
    }
}

const config = require('../config/config.json');
const cmdList = require('./commands');

module.exports = (client, message) => {
    const prefix = config.settings.commands.prefix;

    if (message.content.indexOf(prefix) == 0) {
        const input = message.content;

        let data = getData(input);
        data.client = client;
        data.prefix = prefix;

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
                if (regex.arguments !== null)
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
                data.command = c[0];

                // Fetch and remove subcommand.
                let sc = null;
                if (!!f[cmdIndex].subcommands) {
                    sc = str.match(new RegExp(scRegX));

                    if (sc !== null) {
                        str = str.replace(sc[0], '');
                        data.subcommand = sc.filter((x) => { return x !== undefined && x != sc[0] })[0];
                    }
                }

                // Fetch and remove arguments.
                let args = [];
                if (!!regex.arguments) {
                    args = str.match(regex.arguments);
                    if (args !== null)
                        str = str.replace(args[0], '');
                    else if (regex.argsOptional)
                        args = [];
                }
                else {
                    let argRegX = f[cmdIndex].subcommands[scList[data.subcommand]].regex.arguments;

                    if (argRegX !== null) {

                        let match = str.match(argRegX);

                        if (match === null) {
                            if (!f[cmdIndex].subcommands[scList[data.subcommand]].regex.argsOptional) {
                                message.channel.send('Missing arguments.');
                                return Promise.reject(null);
                            }
                        }
                        else
                            f[cmdIndex].subcommands[scList[data.subcommand]].regex.argumentIndexes.forEach(v => data.arguments.push(match[v]));
                    }
                }

                finished = true;

                if (!f[cmdIndex].enabled)
                    return Promise.reject(null);
                    
                return new Promise((resolve, reject) => {
                    f[cmdIndex].run(message, data)
                        .then(response => {
                            response.content.forEach(msg => {
                                message.channel.send(msg)
                                    .then(msg => {
                                        if (!!response.options && !!response.options.clear)
                                            setTimeout(() => { msg.delete().catch(err => reject(err)) }, response.options.clear * 1000);

                                        if (!!f[cmdIndex].settings) {
                                            if (!!f[cmdIndex].settings.responseClear)
                                                setTimeout(() => { msg.delete().catch(err => reject(err)) }, f[cmdIndex].settings.responseClear.delay * 1000);

                                            if (!!f[cmdIndex].settings.commandClear) {
                                                setTimeout(() => {
                                                    message.delete()
                                                        .catch(() => {
                                                            message.channel.send('Could not clear command automatically - missing permissions.')
                                                                .then(msg => setTimeout(() => msg.delete().catch(err => reject(err)), 10 * 1000))
                                                                .catch(err => reject(err))
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
    else {
        return Promise.reject(null);
    }
}