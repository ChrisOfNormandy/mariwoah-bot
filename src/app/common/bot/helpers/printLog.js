const config = require('./config');

function getDateString() {
    let date = new Date();
    let dmy = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let time =
        `${(date.getHours() <= 12)
            ? (date.getHours == 0) ? 12 : date.getHours()
            : date.getHours() - 12
        }:${(date.getMinutes() < 10)
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }:${(date.getSeconds() < 10)
            ? `0${date.getSeconds()}`
            : date.getSeconds()
        }:${date.getMilliseconds()}`

    return `> ${dmy} | ${time} `;
}

module.exports = async function (client, string, flag = null) {
    return new Promise(function (resolve, reject) {

        let str = getDateString();

        switch (flag) {
            case 'warn': {
                str += ':warning: - ';
                break;
            }
            case 'error': {
                str += ':rotating_light: - ';
                break;
            }
            case 'info': {
                str += ':information_source: - ';
                break;
            }
            default: {
                str += '- ';
                break;
            }
        }

        str += `"${string}"`;

        try {
            if (client) client.channels.get(config.settings.logChannel).send(str);
            console.log(str);
            resolve(str);
        }
        catch (e) {
            console.log(e);
            try {
                for (i in config.admins)
                    client.users.get(i).send(`Could not global log string:\n${str}`);
            }
            catch (err) {
                reject(err);
            }
            reject(e);
        }
    });
}