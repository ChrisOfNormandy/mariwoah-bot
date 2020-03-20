const getServerConfig = require('./getServerConfig');
const saveServerConfig = require('./saveServerConfig');

module.exports = function (message, prefixes) {
    return new Promise(function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                let prefix = (prefixes) ? prefixes.trim() : '';

                if (prefix == '' || prefix.length > 3)
                    resolve({ config: config, map: config.prefixes, change: false });
                else {
                    config.prefixes = prefix;

                    saveServerConfig(message, config)
                        .then(r => resolve({ config: r, map: prefix, change: true }))
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}