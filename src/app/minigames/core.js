const createUser = require('./helpers/createUser');

module.exports = {
    stats: null,
    mapStats: require('./helpers/mapStats'),

    getUser: function(message) {
        if (this.stats && this.stats.has(message.author.id)) {
            return this.stats.get(message.author.id);
        }
        else {
            let stats = createUser(message);
            this.stats.set(stats.user.id, stats);
            return this.stats.get(message.author.id);
        }
    },
    createUser: (message) => createUser(message),

    gambling: require('./games/gambling/adapter')
}