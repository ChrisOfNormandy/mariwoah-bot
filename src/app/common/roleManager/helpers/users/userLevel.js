const getUser = require('./getUser');
const modUser = require('./modUser');
const getServerConfig = require('../servers/getServerConfig');
const saveServerConfig = require('../servers/saveServerConfig');
const serverMap = require('../servers/serverMap');

module.exports = function (message, userID, operation) {
    getUser(message, userID)
        .then(user => {
            modUser.byString(message, user, operation)
                .then(result => {
                    getServerConfig(message)
                        .then(config => {
                            config.users[userID] = result.user;
                            saveServerConfig(message, config);
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
}