const sql = require('../../sql/adapter');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function setRank(message, userID, rank) {
    return new Promise((resolve, reject) => {
    sql.user.getBotRole(message.guild.id, userID)
    .then(role => {
        if (role == rank)
            resolve({value: chatFormat.response.roles.setRank.botRole_no(message.guild.members.cache.get(userID), rank)});
        else {
            sql.user.setBotRole(message.guild.id, userID, rank);
            resolve({value: chatFormat.response.roles.setRank.botRole(message.guild.members.cache.get(userID), rank)});
        }
    })
    .catch(e => {
        console.log(e);
        resolve({value: chatFormat.response.roles.setRank.botRole_error()});
    })
})
}

function admin(message, userID) {
    return setRank(message, userID, 'admin');
}

function moderator(message, userID) {
    return setRank(message, userID, 'mod');
}

function helper(message, userID) {
    return setRank(message, userID, 'helper');
}

module.exports = {
    admin,
    moderator,
    helper
}