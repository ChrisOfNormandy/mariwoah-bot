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
    return new Promise((resolve, reject) => {
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
                
                if (!!regex.subcommand)
                    r += `\\s(${regex.subcommand.source})`;
                if (regex.arguments !== null)
                    r += `(${regex.arguments.source})${!!regex.argsOptional ? '?' : ''}`;

                let rx = new RegExp(r);

                if (!rx.test(data.content)) {
                    finErr = `Failed test: ${rx}, ${data.content}`;
                    cmdIndex++;
                    continue;
                }
                else {
                    let str = data.content.slice(1);

                    const c = str.match(regex.command);
                    str = str.replace(c[0], '');
                    data.command = c[0];

                    let sc = null;
                    if (!!regex.subcommand) {
                        sc = str.match(regex.subcommand);
                        if (sc !== null)
                            str = str.replace(sc[0], '');
                    }

                    let args = [];
                    if (regex.arguments) {
                        args = str.match(regex.arguments);
                        if (args !== null)
                            str = str.replace(args[0], '');
                        else if (regex.argsOptional)
                            args = [];
                    }

                    if (args === null) {
                        reject('Bad regex; "args" was null.');
                    }
                    else {
                        try {
                            args = args.map(a => a.trim());
                        }
                        catch (e) {
                            args = [];
                        }

                        if (!!regex.subcommand) {
                            let count = 0;

                            while (count < regex.subcommandIndexes.length && data.subcommand === null) {
                                if (regex.subcommand.test(sc[regex.subcommandIndexes[count]]))
                                    data.subcommand = sc[regex.subcommandIndexes[count]].trim();
                                count++;
                            }

                            if (data.subcommand === null) {
                                finErr = "Invalid subcommand provided.";
                                cmdIndex++;
                                continue;
                            }
                        }

                        if (!!args.length)
                            for (let i in regex.argumentIndexes)
                                data.arguments.push(args[regex.argumentIndexes[i]]);
                    }

                    finished = true;
                    
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
                }
            }
            if (!finished)
                reject('Fin. Error: ' + finErr);
        }
        else {
            reject(null);
        }
    });
}