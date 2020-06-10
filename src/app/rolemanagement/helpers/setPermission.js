const sql = require('../../sql/adapter')

function promote(message, userID) {
    sql.user.getPermissionLevel(message.guild.id, userID)
    .then(level => {
        if (level < 4) {
            sql.user.setPermissionLevel(message.guild.id, userID, level + 1);
            message.channel.send(`> Promoted ${message.guild.members.cache.get(userID)} to level ${level + 1}.`);
        }
        else {
            message.channel.send(`> Cannot promote ${message.guild.members.cache.get(userID)} any higher than admin, level ${level}.`);
        }
    })
    .catch(e => {
        console.log(e);
        message.channel.send(`> Failed to promote user due to error.`);
    });
}

function demote(message, userID) {
    sql.user.getPermissionLevel(message.guild.id, userID)
    .then(level => {
        if (level > 0) {
            sql.user.setPermissionLevel(message.guild.id, userID, level - 1);
            message.channel.send(`> Demoted ${message.guild.members.cache.get(userID)} to level ${level - 1}.`);
        }
        else {
            message.channel.send(`> Cannot demote ${message.guild.members.cache.get(userID)} any lower than default, level ${level}.`);
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