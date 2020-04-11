const db = require('../../../sql/adapter');
const cast = require('./helpers/cast');

module.exports = {
    cast: (message) => {cast(message, message.author.id)}
}