const { chatFormat, output } = require('../../../helpers/commands');

const colorList = [
    'red',
    'orange',
    'yellow',
    'lime',
    'green',
    'light_blue',
    'blue',
    'aqua',
    'cyan',
    'purple',
    'light_pink',
    'pink',
    'magenta',
    'white',
    'grey',
    'gray',
    'light_grey',
    'light_gray',
    'black',
    'brown'
];

module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        if (!colorList.includes(data.arguments[0]))
            reject(output.error([], ['Color not supported.']));
        else {
            let flag = null;
            message.member.roles.cache.forEach((v, k, m) => {
                if (colorList.includes(v.name.toLowerCase().replace(' ', '_')))
                    message.member.roles.remove(k)
                        .catch(err => reject(output.error([err], [err.message])));
            });

            message.guild.roles.cache.forEach((v, k, m) => {
                if (flag !== null)
                    return;

                if (v.name.toLowerCase() == data.arguments[0] || v.name.toLowerCase().replace(' ', '_') === data.arguments[0])
                    flag = k;
            });

            if (flag !== null) {
                message.member.roles.add(flag)
                    .then(r => resolve(output.valid([], ['Done!'])))
                    .catch(err => reject(output.error([err], [err.message])));
            }
            else {
                resolve(output.valid([], ['No role found.']));
            }
        }
    });
}