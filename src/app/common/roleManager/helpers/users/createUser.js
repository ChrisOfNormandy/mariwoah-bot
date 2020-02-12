const generateServerData = require('./generateServerData');
const getServerConfig = require('../servers/getServerConfig');
const saveServerConfig = require('../servers/saveServerConfig');

module.exports = async function (message, userID = -1) {
    return new Promise(async function (resolve, reject) {
        let User = {
            id: (userID == -1) ? message.author.id : userID,
            data: generateServerData()
        }

        getServerConfig(message)
            .then(config => {
                config.users[User.id] = User;
                saveServerConfig(message, config)
                    .then(() => resolve(User))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}