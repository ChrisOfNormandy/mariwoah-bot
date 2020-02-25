const modUser = require('./modUser');
const getServerConfig = require('../servers/getServerConfig');
const saveServerConfig = require('../servers/saveServerConfig');

function moderate(message, userID, operation, args = {}) {
    return new Promise(function (resolve, reject) {
        modUser.byString(message, userID, operation, args)
            .then(result => {
                getServerConfig(message)
                    .then(config => {
                        config.users[result.user.id] = result.user;
                        saveServerConfig(message, config);

                        resolve(result);
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

module.exports = function (message, userID, operation, reason, args = {}) {
    let guild = message.channel.guild;
    let user = guild.members.get(userID);

    return new Promise(function (resolve, reject) {
        if (user.hasPermission("ADMINISTRATOR") && (operation == 'kick' || operation == 'ban')) {
            message.channel.send(`Cannot ${operation} admins using a command. You must do so manually.`);
            resolve({ status: false, args: { operation: operation, result: false }, user: user });
            return;
        }

        switch (operation) {
            case 'warn': {
                moderate(message, userID, 'warn', { reason: reason, user: user })
                    .then(r => resolve(r))
                    .catch(e => reject(e));
                return;
            }
            case 'kick': {
                user.kick(reason)
                    .then(_user => {
                        moderate(message, userID, 'kick', { reason: reason, user: _user })
                            .then(r => resolve(r))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
                return;
            }
            case 'ban': {
                guild.ban(user, { days: args.days, reason: reason })
                    .then(_user => {
                        moderate(message, userID, 'ban', { reason: reason, days: args.days, user: _user })
                            .then(r => resolve(r))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
                return;
            }
            case 'unban': {
                guild.unban(userID)
                    .then(_user => {
                        moderate(message, userID, 'banRevert', { reason: reason, user: _user })
                            .then(r => resolve(r))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
                return;
            }
            case 'reset': {
                moderate(message, userID, 'reset')
                    .then(r => resolve(r))
                    .catch(e => reject(e));
                return;
            }
        }
    });
}