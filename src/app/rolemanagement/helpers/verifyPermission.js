const db = require('../../sql/adapter');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

module.exports = function (message, userID, permLevel) {
    return new Promise((resolve, reject) => {
        db.user.getPermissionLevel(message.channel.guild.id, userID)
            .then(userLevel => {
                if (userLevel < 4 && message.member.hasPermission("ADMINISTRATOR")) {
                    db.user.setPermissionLevel(message.guild.id, userID, 4)
                        .then(r => {
                            resolve({state: true, reason: 'Admin'});
                        })
                        .catch(e => reject(e))
                }
                else {
                    if (userLevel >= permLevel)
                        resolve({state: true, reason: ''});
                    else {
                        resolve({state: false, reason: chatFormat.response.roles.verifyPermission(permLevel)});
                    }
                }
            })
            .catch(e => reject(e));
    });
}