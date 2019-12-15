const memeDispatcher = require('./helpers/memeDispatcher');

module.exports = {
    memeDispatch: function(message, meme) {
        message.channel.send(
            '', {
                file: memeDispatcher(meme)
            }
        );
    }
}