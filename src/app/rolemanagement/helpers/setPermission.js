const sql = require('../../sql/adapter');
const setRoles = require('../../rolemanagement/helpers/setRoles');

function promote(message, userID, toLevel = null) {
    sql.user.getPermissionLevel(message.guild.id, userID)
        .then(level => {
            if (toLevel && toLevel >= 0 && toLevel <= 4) {
                sql.user.setPermissionLevel(message.guild.id, userID, toLevel)
                .then(r => {
                    message.channel.send(`> Promoted ${message.guild.members.cache.get(userID)} to level ${toLevel}.`);
                    setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                })
                .catch(e => console.log(e));
            }
            else if (level < 4) {
                sql.user.setPermissionLevel(message.guild.id, userID, level + 1)
                .then(r => {
                    message.channel.send(`> Promoted ${message.guild.members.cache.get(userID)} to level ${level + 1}.`);
                    setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                })
                .catch(e => console.log(e));
            }
            else {
                if (level > 4)
                    message.channel.send(`> Cannot promote ${message.guild.members.cache.get(userID)} any higher than admin, level ${level}.`);
                else
                    message.channel.send(`> Failed to promote user.`);
            }
        })
        .catch(e => {
            console.log(e);
            message.channel.send(`> Failed to promote user due to error.`);
        });
}

function demote(message, userID, toLevel = null) {
    sql.user.getPermissionLevel(message.guild.id, userID)
        .then(level => {
            if (toLevel && toLevel >= 0 && toLevel <= 4) {
                sql.user.setPermissionLevel(message.guild.id, userID, toLevel)
                .then(r => {
                    message.channel.send(`> Demoted ${message.guild.members.cache.get(userID)} to level ${toLevel}.`);
                    setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                })
                .catch(e => console.log(e));
            }
            else if (level > 0) {
                sql.user.setPermissionLevel(message.guild.id, userID, level - 1)
                    .then(r => {
                        message.channel.send(`> Demoted ${message.guild.members.cache.get(userID)} to level ${level - 1}.`);
                        setRoles.refresh_user(message, message.guild.members.cache.get(userID));
                    })
                    .catch(e => console.log(e));
            }
            else {
                if (level <= 0)
                    message.channel.send(`> Cannot demote ${message.guild.members.cache.get(userID)} any lower than default, level ${level}.`);
                else
                    message.channel.send(`> Failed to demote user.`);
            }
        })
        .catch(e => {
            console.log(e);
            message.channel.send(`> Failed to demote user due to error.`);
        });
}

module.exports = {
    promote,
    demote,
}