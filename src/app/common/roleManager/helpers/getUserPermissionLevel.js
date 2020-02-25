const getUser = require('./users/getUser');
const getServerConfig = require('./servers/getServerConfig');

module.exports = function (message, userID) {
    return new Promise(function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                if (config)
                    getUser(message, userID)
                        .then(user => {
                            resolve({
                                level: user.data.permissions.level,
                                botAdmin: user.data.permissions.botAdmin,
                                botMod: user.data.permissions.botMod,
                                botHelper: user.data.permissions.botHelper
                            });
                        })
                        .catch(e => reject(e));
                else
                    reject(null);
            })
            .catch(e => reject(e));
    })
}