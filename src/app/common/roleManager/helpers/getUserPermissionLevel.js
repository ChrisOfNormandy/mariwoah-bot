const getUser = require('./users/getUser');
const getServerConfig = require('./servers/getServerConfig');

module.exports = async function (message, userID) {
    return new Promise(async function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                getUser(message, userID)
                    .then(user => {
                        resolve(
                            {
                                level: user.data.permissions.level,
                                botAdmin: user.data.permissions.botAdmin,
                                botMod: user.data.permissions.botMod,
                                botHelper: user.data.permissions.botHelper
                            }
                        );
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    })
}