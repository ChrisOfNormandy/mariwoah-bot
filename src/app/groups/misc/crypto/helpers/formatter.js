const Discord = require('discord.js');
const { chatFormat, output } = require('../../../../helpers/commands');
const api = require('../api');

module.exports = (coin, name) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(`${coin} | ${name} Stats`)
        .setColor(chatFormat.colors.byName.lightyellow);
    return new Promise((resolve, reject) => {
        api(coin)
            .then(data => {
                if (!data) {
                    embed.addField('Uh oh', 'Failed to get current stats.');
                    resolve(output.valid([data], [embed]));
                }
                else {
                    let str = '';
                    let v = data.data.entries;
                    for (let i in v) {
                        str += `${(i <= v.length - 1 && i > 0)
                            ? (v[i][1] > v[i - 1][1])
                                ? ':arrow_up_small: -- '
                                : (v[i][1] < v[i - 1][1])
                                    ? ':arrow_down_small: -- '
                                    : ':arrow_right_small: -- '
                            : ':record_button: -- '}$ ${v[i][1]}`;
                        if (i < v.length - 1)
                            str += '\n';
                    }
                    embed.addField(`${name} stats from ${data.startTime.replace('T', ' ')} to ${data.endTime.replace('T', ' ')}:`, str);
                    embed.setDescription(`**$ ${v[v.length - 1][1].toFixed(4)}**`);
                    resolve(output.valid([data], [embed]));
                }
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}