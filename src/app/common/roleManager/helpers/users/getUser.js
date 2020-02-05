const createUser = require('./createUser');
const getSeverConfig = require('../servers/getServerConfig');
const saveServerConfig = require('../servers/saveServerConfig');

module.exports = async function(message, userID) {
    return new Promise(async function(resolve, reject) {
        getSeverConfig(message)
        .then(config => {
            if (config.users[userID]) resolve(config.users[userID]);
            else {
                console.log('Could not find user file in server config, creating new user file for ' + userID);

                createUser(message, userID)
                .then(user => {
                    config.users[userID] = user;
                    saveServerConfig(config)
                    .then(r => {
                        resolve(config.users[userID]);
                    })
                    .catch(e => reject(e));
                })
                .catch(e => reject(e));
            }
        })
        .catch(e => reject(e));
    });
}