const config = require('../../private/config');

function pullRegex(content) {   
    let flags = {};
    let mentions = {
        members: new Map(),
        roles: new Map()
    };

    const flagRegex = /\s-[a-zA-Z]+\s*/g;
    const boolParamRegex = /\?\w+:(t|f)/g;
    const stringParamRegex = /\$\w+:".*?"/g;
    const grepParamRegex = /grep:'\/.+?\/[gimsuy]?'/g;
    const intParamRegex = /\^\w+:-?\d+/g;
    const doubleParamRegex = /%\w+:-?\d+\.\d+/g;
    const memberRegex = /<@!\d{18}>/g;
    const roleRegex = /<@&\d{18}>/g;

    let params = {
        'boolean': [],
        'string': [],
        'regex': [],
        'integer': [],
        'double': []
    }
    let parameters = {
        'boolean': {},
        'string': {},
        'regex': {},
        'integer': {},
        'double': {}
    }

    let urls = content.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    content = content.replace(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '');

    params.boolean = content.match(boolParamRegex);
    content = content.replace(boolParamRegex, '');
    params.string = content.match(stringParamRegex);
    content = content.replace(stringParamRegex, '');
    params.regex = content.match(grepParamRegex);
    content = content.replace(grepParamRegex, '');
    params.integer = content.match(intParamRegex);
    content = content.replace(intParamRegex, '');
    params.double = content.match(doubleParamRegex);
    content = content.replace(doubleParamRegex, '');

    const members = content.match(memberRegex);
    content = content.replace(memberRegex, '');
    for (let i in members)
        mentions.members.set(members[i].replace('<@!', '').replace('>', ''), true);

    const roles = content.match(roleRegex);
    content = content.replace(roleRegex, '');
    for (let i in roles)
        mentions.roles.set(roles[i].replace('<@&', '').replace('>', ''), true);

    content = content.replace(/>\s\w/g, '').trim();

    if (!urls)
        urls = [];

    if (flagRegex.test(content)) {
        let flagArr = content.match(flagRegex)[0].slice(1).split('');
        for (let x in flagArr) {
            flags[flagArr[x]] = true;
        }
        content = content.replace(flagRegex, '');
    }

    for (let x in params.boolean) {
        if (params.boolean[x]) {
            arr = params.boolean[x].slice(1).split(':');
            if (arr.length)
                parameters.boolean[arr[0]] = arr[1] === 't';
        }
    }
    for (let x in params.string) {
        if (params.string[x]) {
            arr = params.string[x].slice(1).split(':');
            if (arr.length)
                parameters.string[arr[0]] = arr[1].replace(/'/g, ``).replace(/"/g, ``);
        }
    }
    for (let x in params.integer) {
        if (params.integer[x]) {
            arr = params.integer[x].slice(1).split(':');
            if (arr.length)
                parameters.integer[arr[0]] = Number(arr[1]);
        }
    }
    for (let x in params.double) {
        if (params.double[x]) {
            arr = params.double[x].slice(1).split(':');
            if (arr.length)
                parameters.double[arr[0]] = Number(arr[1]);
        }
    }

    let arguments = (content) ? content.split(' ') : [];
    if (!arguments)
        arguments = [];

    let val = {
        flags,
        parameters,
        urls,
        mentions,
        arguments,
        mentions
    }

    return val;
}

function get(prefix, part) {
    return new Promise((resolve, reject) => {
        let msgArray = part.split(' ');

        const prefixes = [prefix, config.settings.prefix];

        const reg = `[${prefixes.join('')}][a-zA-Z?]+`;
        const commandRegex = new RegExp(reg, 'g');

        if (!commandRegex.test(msgArray[0]) && !prefixes.join('').includes(msgArray[0][0])) {
            reject(null);
        } else {
            let regex_arr = [];
            const passThrough = `${reg}.*\\s>\\s([a-zA-Z])`;
            const passThroughRegex = new RegExp(passThrough, '');
            const outputVariables = {
                cache: {},
                out: []
            };

            let commands = [];

            const passThrough_arr = part.split('=>');
            
            let passTo_arr = [];
            let non_passTo_arr = [];

            for (let i in passThrough_arr) {
                if (passThrough_arr[i].match(passThroughRegex) !== null)
                    passTo_arr.push(passThrough_arr[i].match(passThroughRegex));
                else
                    non_passTo_arr.push(passThrough_arr[i]);
            }

            for (let i in passTo_arr) {
                let reg_values = pullRegex(passTo_arr[i][0].replace(new RegExp(`${reg}\\s`, 'g'), ''));

                outputVariables.cache[passTo_arr[i][1]] = {
                    index: i,
                    value: null
                };
                
                commands.push(passTo_arr[i][0].split(' >')[0].match(commandRegex)[0]);   
                regex_arr.push(reg_values);            
            }

            for (let i in non_passTo_arr) {
                content = non_passTo_arr[i].trim();
                commands.push(content.match(commandRegex)[0]);
                content = content.replace(commandRegex, '').trim();
                let reg_values = pullRegex(content);
                regex_arr.push(reg_values);
            }

            for (let c in commands) {
                commands[c] = commands[c].slice(1);
            }

            let data_array = [];
            for (let i in commands) {
                data_array.push({
                    command: commands[i],
                    arguments: regex_arr[i].arguments,
                    parameters: regex_arr[i].parameters,
                    flags: regex_arr[i].flags,
                    urls: regex_arr[i].urls,
                    mentions: regex_arr[i].mentions
                });
            }

            resolve({
                data_array,
                outputVariables
            });
        }
    });
}

module.exports = {
    get
}