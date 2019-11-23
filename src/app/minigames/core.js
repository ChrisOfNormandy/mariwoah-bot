const createUser = require('./helpers/createUser');
const getUser = require('./helpers/getUser');

module.exports = {
    stats: null,
    mapStats: require('./helpers/mapStats'),

    getUser: function (message) {return getUser(message, this.stats)},
    createUser: (message) => createUser(message),

    gambling: require('./games/gambling/adapter')
}