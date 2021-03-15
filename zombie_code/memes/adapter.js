const memeDispatcher = require('./helpers/memeDispatcher');
const Discord = require('discord.js');
const commandFormat = require('../common/bot/helpers/global/commandFormat');

module.exports = {
    memeDispatch: function (meme) {
        let image = new Discord.MessageAttachment(memeDispatcher(meme));
        return (commandFormat.valid([image], [{files:[image]}]));
    }
}