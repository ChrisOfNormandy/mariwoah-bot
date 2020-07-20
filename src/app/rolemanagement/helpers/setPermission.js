const sql = require('../../sql/adapter');
const setRoles = require('../../rolemanagement/helpers/setRoles');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function promote(message, userID, toLevel = null) {
    return new Promise((resolve, reject) => {
        sql.user.getPermissionLevel(message.guild.id, userID)
            .then(level => {
                if (toLevel && toLevel >= 0 && toLevel <= 4) {
                    sql.user.setPermissionLevel(message.guild.id, userID, toLevel)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: chatFormat.response.roles.promote(message.guild.members.cache.get(userID), toLevel)});
                        })
                        .catch(e => reject(e));
                }
                else if (level < 4) {
                    sql.user.setPermissionLevel(message.guild.id, userID, level + 1)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: chatFormat.response.roles.promote(message.guild.members.cache.get(userID), level + 1)});
                        })
                        .catch(e => reject(e));
                }
                else {
                    if (level > 4)
                        resolve({value: chatFormat.response.roles.no_promote(message.guild.members.cache.get(userID), level)});
                    else
                        resolve({value: chatFormat.response.roles.fail_promote()});
                }
            })
            .catch(e => {
                console.log(e);
                resolve({value: chatFormat.response.roles.fail_promote()});
            });
    });
}

function demote(message, userID, toLevel = null) {
    return new Promise((resolve, reject) => {
        sql.user.getPermissionLevel(message.guild.id, userID)
            .then(level => {
                if (toLevel && toLevel >= 0 && toLevel <= 4) {
                    sql.user.setPermissionLevel(message.guild.id, userID, toLevel)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: chatFormat.response.roles.demote(message.guild.members.cache.get(userID), toLevel)});
                        })
                        .catch(e => reject(e));
                }
                else if (level > 0) {
                    sql.user.setPermissionLevel(message.guild.id, userID, level - 1)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: chatFormat.response.roles.demote(message.guild.members.cache.get(userID), level - 1)});
                        })
                        .catch(e => reject(e));
                }
                else {
                    if (level <= 0)
                        resolve({value: chatFormat.response.roles.no_demote(message.guild.members.cache.get(userID), level)});
                    else
                        resolve({value: chatFormat.response.roles.fail_demote()});
                }
            })
            .catch(e => {
                console.log(e);
                resolve({value: chatFormat.response.roles.fail_demote()});
            });
    });
}

module.exports = {
    promote,
    demote,
}