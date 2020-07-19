const sql = require('../../sql/adapter');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

module.exports = function (message, userID, permLevel) {
    return new Promise((resolve, reject) => {
        sql.user.getPermissionLevel(message.channel.guild.id, userID)
            .then(userLevel => {
                if (userLevel < 4 && message.member.hasPermission("ADMINISTRATOR")) {
                    sql.user.setPermissionLevel(message.guild.id, userID, 4)
                        .then(r => {
                            resolve({state: true, reason: 'Admin'});
                        })
                        .catch(e => reject(e))
                }
                else {
                    if (userLevel >= permLevel)
                        resolve({state: true, reason: ''});
                    else {
                        resolve({state: false, reason: {value: chatFormat.response.roles.verifyPermission(permLevel)}});
                    }
                }
            })
            .catch(e => reject(e));
    });
}