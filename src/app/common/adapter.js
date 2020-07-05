const chatFormat = require('./bot/helpers/global/chatFormat');

function recur(input, tab) {
    let str = '';

    for (let i in input) {
        if (typeof input[i] == 'object') {
            if (Object.keys(input[i]).length || input[i].length) {
                str += ('.').repeat(tab * 3) + ' **' + i + '**: ';
                str += '\n' + recur(input[i], tab + 1);
            }
        }
        else {
            str += ('.').repeat(tab * 3) + ' **' + i + '**: ';
            str += input[i] + '\n';
        }
    }

    return str;
}

function debug(input, useEmbed = true) {
    if (useEmbed) {
        let embed = {
            title: 'Debug Output',
            color: chatFormat.colors.byName.white,
            fields: [
                {
                    name: 'value: ', value: JSON.stringify(input.value)
                },
                {
                    name: 'result: ', value: recur(input.result, 0)
                }
            ]
        };
        return { embed };
    }
    else {
        return '```js\n' + JSON.stringify(input) + '```';
    }
}

module.exports = {
    bot: require('./bot/adapter'),
    debug
}