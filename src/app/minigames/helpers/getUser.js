const createUser = require('./createUser');
const pushStats = require('./pushStats');

module.exports = function(message, stats) {
    if (stats && stats.has(message.author.id)) {
        return stats.get(message.author.id);
    }
    else {
        let user = createUser(message);
        stats.set(user.definition.id, user);
        pushStats();
        return stats.get(user.definition.id);
    }
}