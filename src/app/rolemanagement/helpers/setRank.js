const sql = require('../../sql/adapter');

function setRank(message, userID, rank) {
    sql.user.getBotRole(message.guild.id, userID)
    .then(role => {
        if (role == rank)
            message.channel.send(`> ${message.guild.members.cache.get(userID)} is already a bot ${rank}.`);
        else {
            sql.user.setBotRole(message.guild.id, userID, rank);
            message.channel.send(`> Moved ${message.guild.members.cache.get(userID)} to the bot ${rank} group.`);
        }
    })
    .catch(e => {
        console.log(e);
        message.channel.send(`> Failed to move member to role group due to error.`);
    })
}

function admin(message, userID) {
    setRank(message, userID, 'admin');
}

function moderator(message, userID) {
    setRank(message, userID, 'mod');

}

function helper(message, userID) {
    setRank(message, userID, 'helper');

}

module.exports = {
    admin,
    moderator,
    helper
}