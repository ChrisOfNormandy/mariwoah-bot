const getServerConfig = require('./getServerConfig');

module.exports = async function (message, args) {
    return new Promise(function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                config.motd = args.join(' ');
                resolve(config);
            })
            .catch(e => reject(e));
    });
}