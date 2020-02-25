const getServerConfig = require('../servers/getServerConfig');
const modUser = require('./modUser');
const saveServerConfig = require('../servers/saveServerConfig');
const serverMap = require('../servers/serverMap');

module.exports = function (message, userID, roleName) {
    return new Promise(function (resolve, reject) {
        getServerConfig(message)
            .then(config => {
                modUser.byString(message, userID, `setBot${roleName}`)
                    .then(result => {
                        if (result.status)
                            message.channel.send(`Set user to bot ${roleName}.`);
                        else
                            message.channel.send(`User is already a bot ${roleName}.`);

                        config.users[userID] = result.user;

                        saveServerConfig(message, config)
                            .then(r => {
                                resolve(r)
                            })
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}