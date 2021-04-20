const cast = require('./helpers/cast');

module.exports = {
    cast: (message) => {return cast(message, message.author.id)}
}