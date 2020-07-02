const memeDispatcher = require('./helpers/memeDispatcher');
const Discord = require('discord.js');

module.exports = {
    memeDispatch: function (meme) {
        let image = new Discord.MessageAttachment(memeDispatcher(meme));
        return ({files:[image]});
    }
}