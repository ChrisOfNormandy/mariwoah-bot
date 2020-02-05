const createUser = require('./helpers/users/createUser');
const modUser = require('./helpers/users/modUser');
const getUser = require('./helpers/users/getUser');
const userInfo = require('./helpers/users/userInfo');
const saveServerConfig = require('./helpers/servers/saveServerConfig');
const verifyPermission = require('./helpers/verifyPermission');
const serverMap = require('./helpers/servers/serverMap');
const userRoleInfo = require('./helpers/users/userRoleInfo');
const userInfoList = require('./helpers/users/userInfoList');
const createServerConfig = require('./helpers/servers/createServerConfig');
const motd = require('./helpers/servers/motd');
const setmotd = require('./helpers/servers/setmotd');

function modUserReturn(result, message = null) {
    if (!result.status || message === null) return 'Operation failed.';

    switch (result.args.operation) {
        case 'warn': return `Warned user for ${(result.user.data.latestWarning.reason) ? 'reason "' + result.user.data.latestWarning.reason + '."' : 'an unspecified reason.' } User currently has ${result.user.data.warnings.length} warning${result.user.data.warnings.length != 1 ? 's' : '' } on this server.`
        case 'kick': return `Kicked user for ${(result.user.data.latestKick.reason) ? 'reason "' + result.user.data.latestKick.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.kicks.length} kick${result.user.data.kicks.length != 1 ? 's' : ''} on this server.`
        case 'ban': return `Banned user for ${(result.user.data.latestBan.reason) ? 'reason "' + result.user.data.latestBan.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.bans.length} ban${result.user.data.bans.length != 1 ? 's' : ''} on this server.`
        case 'banRevert': return `Pardoned user for ${(result.user.data.latestBanRevert.reason) ? 'reason "' + result.user.data.latestBanRevert.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.banReverts.length} ban revert${result.user.data.banReverts.length != 1 ? 's' : ''} on this server.`
        case 'reset': return `Reset roleManager data for given user.`
        default: return `Operation completed with status: ${result.args.status}`
    }
}

module.exports = {
    createUser: async function(message) {
        await createUser(message);
    },
    modUser: async function(message) {
        modUser.byMessage(message)
        .then(result => {
            message.channel.send(modUserReturn(result, message));
            this.getServerConfig(message)
            .then(config => {
                config.users[result.user.id] = result.user;
                serverMap.map.set(message.channel.guild.id, config);
                saveServerConfig(config);
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
    modUserByString: async function(message, userID, operation, args) {
        modUser.byString(message, userID, operation, args)
        .then(result => {
            message.channel.send(modUserReturn(result, message));
            this.getServerConfig(message)
            .then(config => {
                config.users[result.user.id] = result.user;
                serverMap.map.set(message.channel.guild.id, config);
                saveServerConfig(config);
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
    getUser: async function(message, userID) {
        return getUser(message, userID);
    },

    userInfo: (message, userID) => userInfo(message, userID).catch(e => message.channel.send('Could not fetch user info.')),
    userRoleInfo: (message, userID) => userRoleInfo(message, userID).catch(e => message.channel.send('Could not fetch user info.')),
    userInfoList: (message, userID, listName) => userInfoList(message, userID, listName).catch(e => message.channel.send('Could not fetch user info.')),

    motd: (message) => motd(message),
    setmotd: async function(message, args) {
        setmotd(message, args)
        .then(config => {
            saveServerConfig(config);
        })
        .catch(e => console.log(e));
    },

    promoteUser: async function(message, userID) {
        getUser(message, userID)
        .then(user => {
            modUser.byString(message, user, 'promote')
            .then(result => {
                this.getServerConfig(message)
                .then(config => {
                    config.users[userID] = result.user;
                    serverMap.map.set(message.channel.guild.id, config);
                    saveServerConfig(config);
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
    demoteUser: async function(message, userID) {
        getUser(message, userID)
        .then(user => {
            modUser.byString(message, user, 'demote')
            .then(result => {
                this.getServerConfig(message)
                .then(config => {
                    config.users[userID] = result.user;
                    serverMap.map.set(message.channel.guild.id, config);
                    saveServerConfig(config);
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    getServerConfig: async function(message) {
        return (serverMap.map.has(message.channel.guild.id)) ? serverMap.map.get(message.channel.guild.id) : await createServerConfig(message);
    },
    verifyPermission: function(message, userID, permissionLevel) {
        return verifyPermission(message, userID, permissionLevel);
    },

    setBotAdmin: async function (message, userID) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            _this.getServerConfig(message)
            .then(config => {
                modUser.byString(message, userID, 'setBotAdmin')
                .then(result => {
                    if (result.status) message.channel.send('Set user to botAdmin.');
                    else message.channel.send('User is already a bot admin.');

                    config.users[userID] = result.user;

                    saveServerConfig(config)
                    .then(r => {
                        serverMap.map.set(message.channel.guild.id, config);
                        resolve(r)
                    })
                    .catch(e => reject(e));
                })
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
        })
    },

    kickUser: async function (message, userID, reason = "You have been kicked by an administrator") {
        let guild = message.channel.guild;
        let user = guild.members.get(userID);

        if (user.hasPermission("ADMINISTRATOR")) {
            message.channel.send('Cannot kick admins using a command. You must do so manually.');
            return;
        }

        user.kick(reason)
        .then(_user => {
            modUser.byString(message, userID, 'kick', {reason: reason, user: _user})
            .then(result => {
                message.channel.send(modUserReturn(result, message));
                this.getServerConfig(message)
                .then(config => {
                    config.users[result.user.id] = result.user;
                    serverMap.map.set(message.channel.guild.id, config);
                    saveServerConfig(config);
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        })
        .catch(err => console.log(err));
    },

    banUser: async function (message, userID, days = 1, reason = "You have been banned by an administrator") {
        let guild = message.channel.guild;
        let user = guild.members.get(userID);

        if (user.hasPermission("ADMINISTRATOR")) {
            message.channel.send('Cannot ban admins using a command. You must do so manually.');
            return;
        }

        guild.ban(user, {days: days, reason: reason })
        .then(_user => {
            modUser.byString(message, userID, 'ban', {reason: reason, days: days, user: _user})
            .then(result => {
                message.channel.send(modUserReturn(result, message));
                this.getServerConfig(message)
                .then(config => {
                    config.users[result.user.id] = result.user;
                    serverMap.map.set(message.channel.guild.id, config);
                    saveServerConfig(config);
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        })
        .catch(err => console.log(err));
    },
    unbanUser: async function (message, userID, reason = "Pardoned") {
        let guild = message.channel.guild;
        console.log(userID);
        guild.unban(userID)
        .then(_user => {
            modUser.byString(message, userID, 'banRevert', {reason: reason, user: _user})
            .then(result => {
                message.channel.send(modUserReturn(result, message));
                this.getServerConfig(message)
                .then(config => {
                    config.users[result.user.id] = result.user;
                    serverMap.map.set(message.channel.guild.id, config);
                    saveServerConfig(config);
                })
                .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        })
        .catch(e => {
            console.log(e);
            message.channel.send('User does not have active ban.');
        });
    },
    fetchBans: async function (message) {
        let guild = message.channel.guild;

        guild.fetchBans(true)
        .then(bans => {
            message.channel.send(`Server has ${bans.size} active bans.`);
            let str = "";

            bans.forEach((value, key, map) => {str += `${value.user.username}#${user.user.discriminator}${(user.user.bot) ? ' -BOT-':''}: ${value.reason}\n`;});

            if (str != '') message.channel.send(str);
        })
    }
}