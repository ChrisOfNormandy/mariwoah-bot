const getUser = require('./users/getUser');
const getServerConfig = require('./servers/getServerConfig');

module.exports = async function (message, userID, permissionLevel) {
    return new Promise(async function (resolve, reject) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            resolve({ status: true, reason: 'admin' });
        }

        getServerConfig(message)
            .then(config => {
                getUser(message, userID)
                    .then(user => {
                        let userLevel = user.data.permissions.level;
                        let userPermissions = config.permissions;

                        if (user.data.permissions.botAdmin)
                            resolve({ status: true, reason: 'botAdmin' });
                        if (user.data.permissions.botMod && permissionLevel < 4)
                            resolve({ status: true, reason: 'botMod' });
                        if (user.data.permissions.botHelper && permissionLevel < 3)
                            resolve({ status: true, reason: 'botHelper' });

                        if (userLevel < permissionLevel) {
                            switch (permissionLevel) {
                                case 0: resolve({ status: false, reason: userPermissions.commands.rejectMessage_default });
                                case 1: resolve({ status: false, reason: userPermissions.commands.rejectMessage_vip });
                                case 2: resolve({ status: false, reason: userPermissions.commands.rejectMessage_helper });
                                case 3: resolve({ status: false, reason: userPermissions.commands.rejectMessage_moderator });
                                case 4: resolve({ status: false, reason: userPermissions.commands.rejectMessage_administrator });
                                case 5: resolve({ status: false, reason: userPermissions.commands.rejectMessage_owner });
                            }
                        }

                        resolve({ status: true, reason: 'success' });
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    })
}