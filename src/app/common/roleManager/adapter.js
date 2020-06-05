const punish = require('./helpers/users/punish');
const verifyPermission = require('./helpers/verifyPermission');
const db = require('../../sql/adapter');

function modUserReturn(result, message = null) {
    if (!result.status || message === null) return 'Operation failed.';

    switch (result.args.operation) {
        case 'warn': return `Warned user for ${(result.user.data.latestWarning.reason) ? 'reason "' + result.user.data.latestWarning.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.warnings.length} warning${result.user.data.warnings.length != 1 ? 's' : ''} on this server.`;
        case 'kick': return `Kicked user for ${(result.user.data.latestKick.reason) ? 'reason "' + result.user.data.latestKick.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.kicks.length} kick${result.user.data.kicks.length != 1 ? 's' : ''} on this server.`;
        case 'ban': return `Banned user for ${(result.user.data.latestBan.reason) ? 'reason "' + result.user.data.latestBan.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.bans.length} ban${result.user.data.bans.length != 1 ? 's' : ''} on this server.`;
        case 'banRevert': return `Pardoned user for ${(result.user.data.latestBanRevert.reason) ? 'reason "' + result.user.data.latestBanRevert.reason + '."' : 'an unspecified reason.'} User currently has ${result.user.data.banReverts.length} ban revert${result.user.data.banReverts.length != 1 ? 's' : ''} on this server.`;
        case 'reset': return `Reset roleManager data for given user.`;
        case 'pardon': return `Pardoned user.`;
        default: return `Operation completed with status: ${result.args.status}`;
    }
}

module.exports = {
    promoteUser: function (message, userID) {
        userLevel(message, userID, 'promote');
    },
    demoteUser: function (message, userID) {
        userLevel(message, userID, 'demote');
    },

    verifyPermission: function (message, userID, permissionLevel) {
        return verifyPermission(message, userID, permissionLevel);
    },

    setBotAdmin: function (message, userID) {
        return setBotPerm(message, userID, 'Admin');
    },
    setBotMod: function (message, userID) {
        return setBotPerm(message, userID, 'Mod');
    },
    setBotHelper: function (message, userID) {
        return setBotPerm(message, userID, 'Helper');
    },

    warnUser: function (message, userID, reason = "You have been warned by an administrator") {
        punish(message, userID, 'warn', reason)
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },
    kickUser: function (message, userID, reason = "You have been kicked by an administrator") {
        punish(message, userID, 'kick', reason)
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },
    banUser: function (message, userID, days = 1, reason = "You have been banned by an administrator") {
        punish(message, userID, 'ban', reason, { days: days })
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },
    unbanUser: function (message, userID, reason = "Pardoned") {
        punish(message, userID, 'unban', reason)
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },
    resetUser: function (message, userID) {
        punish(message, userID, 'reset')
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },
    pardonUser: function (message, userID, reason, punishment, index) {
        punish(message, userID, 'pardon', reason, { punishment: punishment, index: index })
            .then(result => message.channel.send(modUserReturn(result, message)))
            .catch(e => console.log(e));
    },

    fetchBans: function (message) {
        let guild = message.channel.guild;

        guild.fetchBans(true)
            .then(bans => {
                message.channel.send(`Server has ${bans.size} active bans.`);
                if (bans.size > 0) {
                    let str = "";

                    bans.forEach((value, key, map) => { str += `${value.user.username}#${value.user.discriminator}${(value.user.bot) ? ' -BOT-' : ''}: ${value.reason}\n`; });

                    if (str != '')
                        message.channel.send(str);
                }
            })
            .catch(e => console.log(e));
    }
}