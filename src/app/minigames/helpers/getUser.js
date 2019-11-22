module.exports = function(stats) {
    if (stats && stats.has(message.author.id)) {
        return stats.get(message.author.id);
    }
    else {
        let user = createUser(message);
        stats.set(user.definition.id, user);
        return stats.get(user.definition.id);
    }
}