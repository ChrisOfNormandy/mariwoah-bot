const { Output } = require('@chrisofnormandy/mariwoah-bot');

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

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    if (!colorList.includes(data.arguments[0]))
        return new Output().makeError('Color not supported.').reject();

    return new Promise((resolve, reject) => {
        let removeList = [];

        data.message.member.roles.cache.forEach((v, k) => {
            if (colorList.includes(v.name.toLowerCase().replace(' ', '_')))
                removeList.push(data.message.member.roles.remove(k));
        });

        Promise.all(removeList)
            .then(() => {
                let flag = null;

                data.message.guild.roles.cache.forEach((v, k) => {
                    if (flag !== null)
                        return;

                    if (v.name.toLowerCase() === data.arguments[0] || v.name.toLowerCase().replace(' ', '_') === data.arguments[0])
                        flag = k;
                });

                if (flag !== null) {
                    data.message.member.roles.add(flag)
                        .then((r) => new Output('Done!').setValues(r).resolve(resolve))
                        .catch((err) => new Output().setError(err).reject(reject));
                }
                else
                    new Output().setError('No role found.').reject(reject);
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
};