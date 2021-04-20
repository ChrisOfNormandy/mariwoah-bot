const Discord = require('discord.js');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const noise = require('../../common/bot/helpers/global/noise');
const search = require('./search');
const queries = require('../../../../private/fifty-fifty_config.json');

function launch(message, data) {
    return new Promise((resolve, reject) => {
        const chance = Math.random();
        let base = -1;
        let values = [-1, -1]
        while (values[0] == base)
            values[0] = Math.round(Math.random(1234) * (queries.safe.length - 1));

        let timeout = 0;
        while (values[1] == base || (values[1] == values[0] && timeout < 20)) {
            values[1] = Math.round(Math.random(1234) * (queries.unsafe.length - 1));
            timeout++;
        }

        const picks = [
            {
                value: queries.safe[values[0]],
                type: 0
            },
            {
                value: queries.unsafe[values[1]],
                type: 1
            }
        ]
        const query = (chance > 0.5)
        ? picks[0]
        : picks[1];

        let newData = data;
        newData.arguments = [];
        newData.arguments.push(query.value);
        newData.parameters.integer['results'] = 50;

        newData.flags['n'] = (query.type == 1);

        search(newData)
            .then(res => {
                if (!res)
                    reject(commandFormat.error([res], ['No.']));
                else {
                    console.log(res.values[0].length);
                    let file = null;
                    while (!file || !file.url)
                        file = res.values[0][Math.round(Math.random() * (res.values[0].length - 1))];

                    const image = new Discord.MessageAttachment(file.url, 'SPOILER_IMAGE.png');

                    file.name = 'SPOILER_IMAGE.png';

                    let arr = [{files: [image]}];
                    arr.push(`Here you are.\n50/50 (Honestly, it's "common or porn" more than 50/50)\n\n***${picks[0].value} or ${picks[1].value}***`);

                    console.log(query.value)

                    resolve(commandFormat.valid([res], arr));
                }
            })
            .catch(e => console.log(e));
        });
}

module.exports = launch;