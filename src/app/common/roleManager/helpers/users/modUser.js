const createUser = require('./createUser');
const getUser = require('./getUser');

module.exports = {
    byMessage: async function(message) {
        let userID = message.mentions.users.first().id;
        let msgArray = message.content.split(' ');
        let operation = msgArray[3];

        getUser(message, userID)
        .then(user => {
            switch (operation) {
                case 'permission_set': {
                    let permissionName = msgArray[4];
                    user.servers[message.channel.guild.id].permissions[permissionName] = msgArray[5];
                    return {status: true, args: {operation: 'permission_set', result: true, user: user}};
                }
                case 'permission_get': {
                    let permissionName = msgArray[4];
                    console.log(user.servers[message.channel.guild.id].permissions[permissionName]);
                    return {status: true, args: {operation: 'permission_get', result: user.servers[message.channel.guild.id].permissions[permissionName]}, user: user};
                }
                case 'permission_override_set': {
                    let permissionName = msgArray[4];
                    user.servers[message.channel.guild.id].permissions.override[permissionName] = msgArray[5];
                    return {status: true, args: {operation: 'permission_override_set', result: true}, user: user};
                }
                case 'permission_override_get': {
                    let permissionName = msgArray[4];
                    console.log(user.servers[message.channel.guild.id].permissions.override[permissionName]);
                    return {status: true, args: {operation: 'permission_override_get', result: user.servers[message.channel.guild.id].permissions.override[permissionName]}, user: user};
                }
            }
        })        
        .catch(e => console.log(e));
    },

    byString: async function(message, userID, operation, args = null) {
        return new Promise(async function(resolve, reject) {
            getUser(message, userID)
            .then(user => {
                switch (operation) {
                    case 'warn': {
                        let date = new Date();
                        user.data.latestWarning = {
                            "time": `${date.toLocaleDateString()} at ${date.toTimeString()}`,
                            "reason": args.reason || ""
                        }
                        user.data.warnings.push(
                            {
                                date: {
                                    day: date.toLocaleDateString(),
                                    time: date.toTimeString()
                                },
                                reason: args.reason,
                                staffID: message.author.id,
                                pardoned: false
                            }
                        )
                        message.channel.guild.members.get(userID).send(
                            `You have been warned by ${message.author.username} in ${message.channel.guild.name}.\n` +
                            `You currently have ${user.data.warnings.length} warning${(user.data.warnings.length > 1) ? 's' : ''} on record.\n` +
                            `\n` +
                            `Reason given: ${args.reason || 'No reason was given'}.` +
                            `\n` +
                            `**__This is an automated message. Responding to this does nothing.__**`
                        );
                        resolve({status: true, args: {operation: 'warn', result: user.data.warnings}, user: user});
                        break;
                    }
                    case 'kick': {
                        let date = new Date();
                        user.data.latestKick = {
                            "time": `${date.toLocaleDateString()} at ${date.toTimeString()}`,
                            "reason": args.reason || ""
                        }
                        user.data.kicks.push(
                            {
                                date: {
                                    day: date.toLocaleDateString(),
                                    time: date.toTimeString()
                                },
                                reason: args.reason,
                                staffID: message.author.id,
                                pardoned: false
                            }
                        )
                        args.user.send(
                            `You have been kicked by ${message.author.username} in ${message.channel.guild.name}.\n` +
                            `You currently have ${user.data.kicks.length} kick${(user.data.kicks.length > 1) ? 's' : ''} on record.\n` +
                            `\n` +
                            `Reason given: ${args.reason || 'No reason was given'}.` +
                            `\n` +
                            `**__This is an automated message. Responding to this does nothing.__**`
                        );
                        resolve({status: true, args: {operation: 'kick', result: user.data.kicks}, user: user});
                        break;
                    }
                    case 'ban': {
                        let date = new Date();
                        user.data.latestBan = {
                            "time": `${date.toLocaleDateString()} at ${date.toTimeString()}`,
                            "reason": args.reason || ""
                        }
                        user.data.bans.push(
                            {
                                date: {
                                    day: date.toLocaleDateString(),
                                    time: date.toTimeString()
                                },
                                reason: args.reason,
                                staffID: message.author.id,
                                pardoned: false
                            }
                        )
                        args.user.send(
                            `You have been banned by ${message.author.username} in ${message.channel.guild.name}.\n` +
                            `You currently have ${user.data.bans.length} ban${(user.data.bans.length > 1) ? 's' : ''} on record.\n` +
                            `\n` +
                            `Reason given: ${args.reason || 'No reason was given'}.` +
                            `\n` +
                            `**__This is an automated message. Responding to this does nothing.__**`
                        );
                        resolve({status: true, args: {operation: 'kick', result: user.data.bans}, user: user});
                        break;
                    }
                    case 'banRevert': {
                        let date = new Date();
                        user.data.latestBanRevert = {
                            "time": `${date.toLocaleDateString()} at ${date.toTimeString()}`,
                            "reason": args.reason || ""
                        }
                        user.data.banReverts.push(
                            {
                                date: {
                                    day: date.toLocaleDateString(),
                                    time: date.toTimeString()
                                },
                                reason: args.reason,
                                staffID: message.author.id,
                                pardoned: false
                            }
                        )
                        args.user.send(
                            `You have been pardoned by ${message.author.username} in ${message.channel.guild.name}.\n` +
                            `You currently have ${user.data.banReverts.length} ban revert${(user.data.banReverts.length > 1) ? 's' : ''} on record.\n` +
                            `\n` +
                            `Reason given: ${args.reason || 'No reason was given'}.` +
                            `\n` +
                            `**__This is an automated message. Responding to this does nothing.__**`
                        );
                        resolve({status: true, args: {operation: 'banRevert', result: user.data.banReverts}, user: user});
                        break;
                    }
                    case 'reset': {
                        createUser(message,  message.mentions.members.first().id)
                        .then(newUser => {
                            resolve({status: true, args: {operation: 'reset', result: newUser}, user: newUser});
                        })
                        .catch(e => reject(e));
                        break;
                    }
                    case 'promote': {
                        if (user.data.permissions.level < 4) {
                            user.data.permissions.level++;
                            switch (user.data.permissions.level) {
                                case 1: {message.channel.send('Promoted user to VIP.'); break;}
                                case 2: {message.channel.send('Promoted user to Helper.'); break;}
                                case 3: {message.channel.send('Promoted user to Moderator.'); break;}
                                case 4: {message.channel.send('Promoted user to Administrator.'); break;}
                            }
                        }
                        else message.channel.send('You cannot promote a user higher than admin!');
                        resolve({status: true, args: {operation: 'promote', result: user}, user: user});
                        break;
                    }
                    case 'demote': {
                        if (user.data.permissions.level > 0) {
                            user.data.permissions.level--;
                            switch (user.data.permissions.level) {
                                case 0: {message.channel.send('Demoted user to default.'); break;}
                                case 1: {message.channel.send('Promoted user to VIP.'); break;}
                                case 2: {message.channel.send('Promoted user to Helper.'); break;}
                                case 3: {message.channel.send('Promoted user to Moderator.'); break;}
                            }
                        }
                        else message.channel.send('You cannot demote a user lower than default!');
                        resolve({status: true, args: {operation: 'demote', result: user}, user: user});
                        break;
                    }
                    case 'setBotAdmin': {
                        if (user.data.permissions.botAdmin) resolve({status: false, args: {operation: 'setBotAdmin', result: user}, user: user});
    
                        user.data.permissions.botAdmin = true;
                        resolve({status: true, args: {operation: 'setBotAdmin', result: user}, user: user});
                        break;
                    }
                }
            })
        });
    }
}