const db = require('../../../sql/adapter');

module.exports = function (message, userID, permLevel) {
    return new Promise((resolve, reject) => {
        db.user.getBotRole(message.channel.guild.id, userID)
            .then(role => {
                if (message.member.hasPermission("ADMINISTRATOR"))
                    resolve('admin');
                else
                    db.user.getPermissionLevel(message.channel.guild.id, userID)
                        .then(level => {
                            if (role == 'admin' && permLevel <= 4)
                                resolve('botAdmin');
                            else if (role == 'mod' && permLevel <= 3)
                                resolve('botMod');
                            else if (role == 'helper' && permLevel <= 2)
                                resolve('botHelper');
                            else if (level < permLevel) {
                                switch (permLevel) {
                                    case 1: reject('Denied: You must have permission level 1 (VIP).');
                                    case 2: reject('Denied: You must have permission level 2 (Helper).');
                                    case 3: reject('Denied: You must have permission level 3 (Mod).');
                                    case 4: reject('Denied: You must have permission level 4 (Admin).');
                                    case 5: reject('Denied: You must have permission level 5 (Owner).');
                                }

                                resolve({ status: true, reason: 'success' });
                            }
                        })
                        .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}