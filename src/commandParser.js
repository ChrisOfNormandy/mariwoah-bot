function getData(input) {
    let str = input;

    const urlRegex = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const flagRegex = /\-[a-zA-Z]/g;

    const urls = input.match(urlRegex);
    if (urls !== null)
        for (let url in urls)
            str = str.replace(urls[url], `<URL:${url}>`);

    const flags = str.match(flagRegex);
    if (flags !== null)
        for (let flag in flags)
            str = str.replace(flags[flag], `<FLAG:${flag}>`);

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
                console.log(regex);
                return regex.test(input);
            });

            console.log(f);

            let cmdIndex = 0;
            let finished = false;

            while (!finished && cmdIndex < f.length) {
                const t = f[cmdIndex].regex.arguments !== null
                    ? data.content.match(new RegExp(f[cmdIndex].regex.command.source + f[cmdIndex].regex.arguments.source))
                    : data.content.match(f[cmdIndex].regex.command);
                        
                console.log('T:', t, data.content, '\n', f[cmdIndex].regex);

                if (t === null) {
                    cmdIndex++;
                    continue;
                }
                else {
                    let str = data.content.slice(1);
                    console.log(str);

                    const c = str.match(f[cmdIndex].regex.command);
                    str = str.replace(c[0], '');

                    console.log(str);
                    const a = f[cmdIndex].regex.arguments !== null
                        ? str.match(f[cmdIndex].regex.arguments)
                        : [];
                    console.log(str.match(f[cmdIndex].regex.arguments));
                    data['command'] = c[0];
                    data['arguments'] = [];

                    if (a === null) {
                        cmdIndex++;
                        continue;
                    }

                    a.forEach((v, i) => {
                        if (f[cmdIndex].regex.argumentIndexes.includes(i) && v !== undefined)
                            data['arguments'].push(v.trim());
                    });

                    console.log(data.prefix, data.command, data.arguments, data.urls);
                    finished = true;

                    f[cmdIndex].run(message, data)
                        .then(response => {
                            // console.log(response);

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
                            console.log(err);

                            err.content.forEach(msg => {
                                message.channel.send(msg);
                            });
                            reject(err.rejections[0]);
                        });
                    }
            }
            if (!finished)
                reject(null);
        }
        else {
            reject(null);
        }
    });
}