function getData(input) {
    let str = input;

    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const flagRegex = /\s\-[a-zA-Z]+/g;

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
        content: str,
        urls: urls === null ? [] : urls,
        flags: flags === null ? [] : flags,
        parameters
    }
}

module.exports = (client, message) => {
    return new Promise((resolve, reject) => {
        const prefix = require('../config/config.json').settings.commands.prefix;

        if (message.content.indexOf(prefix) == 0) {
            const input = message.content;

            let data = getData(input);
            data['client'] = client;
            data['prefix'] = prefix;

            const cmdList = require('./commands');
            const f = cmdList.filter((cmd) => {
                const regex = new RegExp('~(' + cmd.regex.command.source + ')');
                return regex.test(input);
            });

            let cmdIndex = 0;
            let finished = false;
            let finErr = "";

            while (!finished && cmdIndex < f.length) {
                const regex = f[cmdIndex].regex;
                console.log('##### TESTING #####');
                console.log(regex);

                let r = `${prefix}(${regex.command.source})`;
                if (!!regex.subcommand)
                    r += `\\s(${regex.subcommand.source})`;
                if (regex.arguments !== null)
                    r += `(${regex.arguments.source})`;
                if (!!regex.argsOptional)
                    r += '?';
                
                let rx = new RegExp(r);

                console.log('RegExp:', rx);
                console.log('Testing:', data.content);

                if (!rx.test(data.content)) {
                    console.log('Test failed. Moving on...');
                    cmdIndex++;
                    continue;
                }
                else {
                    let str = data.content.slice(1);

                    const c = str.match(regex.command);
                    str = str.replace(c[0], '');

                    const a = regex.arguments !== null
                        ? str.match(regex.arguments)
                        : [];

                    console.log('Argument match array:', a);

                    data['command'] = c[0];
                    data['arguments'] = [];
                    data['subcommand'] = null;

                    if (!!regex.subcommand) {
                        console.log('Testing subcommands.');
                        let count = 0;

                        while (count < regex.subcommandIndexes.length && data['subcommand'] === null) {
                            if (regex.subcommand.test(a[regex.subcommandIndexes[count]]))
                                data['subcommand'] = a[regex.subcommandIndexes[count]];
                            count++;
                        }

                        if (data['subcommand'] === null) {
                            finErr = "Invalid subcommand provided.";
                            cmdIndex++;
                            continue;
                        }
                    }

                    a.forEach((v, i) => {
                        if (regex.argumentIndexes.includes(i) && v !== undefined)
                            data['arguments'].push(v.trim());
                    });

                    console.log('>', data.content, '\n', data.subcommand, '\n', data.arguments, '\n', data.flags, '\n', data.urls);

                    finished = true;

                    f[cmdIndex].run(message, data)
                        .then(response => {
                            response.content.forEach(msg => {
                                message.channel.send(msg)
                                    .then(msg => {
                                        if (!!response.options && !!response.options.clear)
                                            setTimeout(() => {msg.delete()}, response.options.clear * 1000);
                                    })
                                    .catch(err => reject(err));
                            });
                        })
                        .catch(err => {
                            console.error(err);

                            err.content.forEach(msg => {
                                if (!!msg)
                                    message.channel.send(msg);
                            });

                            reject(err.rejections[0]);
                        });
                    }
            }
            if (!finished)
                reject(finErr);
        }
        else {
            reject(null);
        }
    });
}