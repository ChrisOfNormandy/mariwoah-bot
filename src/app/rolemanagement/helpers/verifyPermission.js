const db = require('../../sql/adapter');

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
                        resolve({state: false, reason: `You must be level ${permLevel} to use that command.`});
                    }
                }
            })
            .catch(e => reject(e));
    });
}