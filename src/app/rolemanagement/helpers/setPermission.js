const sql = require('../../sql/adapter');
const setRoles = require('./setRoles');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');

function _promote(message, userID, toLevel) {
    // console.log(userID, toLevel);
    return new Promise((resolve, reject) => {
        sql.users.getPermissionLevel(message.guild.id, userID)
            .then(level => {
                // console.log(level);
                if (toLevel && toLevel >= 0 && toLevel <= 4) {
                    sql.users.setPermissionLevel(message.guild.id, userID, toLevel)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: toLevel, content: chatFormat.response.roles.promote(message.guild.members.cache.get(userID), toLevel)});
                        })
                        .catch(e => reject(e));
                }
                else if (level < 4) {
                    sql.users.setPermissionLevel(message.guild.id, userID, level + 1)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: level + 1, content: chatFormat.response.roles.promote(message.guild.members.cache.get(userID), level + 1)});
                        })
                        .catch(e => reject(e));
                }
                else {
                    if (level > 4)
                        resolve({value: level, content: chatFormat.response.roles.no_promote(message.guild.members.cache.get(userID), level)});
                    else
                        resolve({value: null, content: chatFormat.response.roles.fail_promote()});
                }
            })
            .catch(e => reject(e));
    });
}

function promote(message, data) {
    let promiseArr = [];
    data.mentions.members.forEach((v, k, m) => {
        promiseArr.push(_promote(message, k, data.arguments[0]));
    });

    return new Promise((resolve, reject) => {
        Promise.all(promiseArr)
            .then(results => {
                let content = [];
                let values = [];

                for (let i in results) {
                    values.push(results[i].value);
                    content.push(results[i].content);
                }
                resolve(commandFormat.valid(values, content));
            })
            .catch(e => reject(commandFormat.error([e], [])));
    });
}

function demote(message, userID, toLevel = null) {
    return new Promise((resolve, reject) => {
        sql.user.getPermissionLevel(message.guild.id, userID)
            .then(level => {
                if (toLevel && toLevel >= 0 && toLevel <= 4) {
                    sql.users.setPermissionLevel(message.guild.id, userID, toLevel)
                        .then(r => {
                            setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                            resolve({value: chatFormat.response.roles.demote(message.guild.members.cache.get(userID), toLevel)});
                        })
                        .catch(e => reject(e));
                }
                else if (level > 0) {
                    sql.users.setPermissionLevel(message.guild.id, userID, level - 1)
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