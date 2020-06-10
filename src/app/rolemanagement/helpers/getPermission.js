const sql = require('../../sql/adapter');

module.exports = function(message, userID) {
    return sql.user.getPermissionLevel(message.guild.id, userID);
}