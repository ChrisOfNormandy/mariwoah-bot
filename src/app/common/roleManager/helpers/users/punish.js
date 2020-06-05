const modUser = require('./modUser');

function moderate(message, userID, operation, args = {}) {
    return new Promise((resolve, reject) =>  {
        modUser.byString(message, userID, operation, args)
            .then(result => {
                // getServerConfig(message)
                //     .then(config => {
                //         config.users[result.user.id] = result.user;
                //         saveServerConfig(message, config);

                //         resolve(result);
                //     })
                //     .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

module.exports = function (message, userID, operation, reason, args = {}) {
    let guild = message.channel.guild;
    let user = guild.members.cache.get(userID);

    return new Promise((resolve, reject) =>  {
        if (user && user.hasPermission("ADMINISTRATOR") && (operation == 'kick' || operation == 'ban')) {
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
                moderate(message, userID, 'kick', { reason: reason, user: user })
                    .then((result) => {
                        user.kick(reason)
                            .then(r => resolve(result))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
                return;
            }
            case 'ban': {
                moderate(message, userID, 'ban', { reason: reason, days: args.days, user: user })
                    .then((result) => {
                        guild.ban(user, { days: args.days, reason: reason })
                            .then(r => resolve(result))
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
                return;
            }
            case 'unban': {
                moderate(message, userID, 'banRevert', { reason: reason, user: user })
                    .then((result) => {
                        guild.unban(userID)
                            .then(r => resolve(result))
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
            case 'pardon': {
                moderate(message, userID, 'pardon', { reason: reason, punishment: args.punishment, index: args.index })
                    .then(r => resolve(r))
                    .catch(e => reject(e));
                return;
            }
        }
    });
}