const memeDispatcher = require('./helpers/memeDispatcher');

module.exports = {
    memeDispatch: function (message, meme) {
        message.channel.send('', { file: memeDispatcher(meme) });
        try {
            message.delete();
        }
        catch (e) {
            message.channel.send('I require admin permissions to operate correctly.');
        }
    }
}