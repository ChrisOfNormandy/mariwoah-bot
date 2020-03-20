const getServerConfig = require('./getServerConfig');
const newConfig = require('./newConfig');
const saveServerConfig = require('./saveServerConfig');

module.exports = function (message) {
    return new Promise(function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                const newCfg = newConfig(message);
                for (let [key, val] of Object.entries(newCfg)) {
                    if (key == 'users' || config[key])
                        continue;
                    else
                        config[key] = newCfg[key];
                }

                saveServerConfig(message, config, true)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}