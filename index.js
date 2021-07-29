module.exports = {
    client: require('./client'),
    commands: require('./src/app/groups'),
    Command: require('./src/app/objects/Command'),
    Output: require('./src/app/objects/Output'),
    MessageData: require('./src/app/objects/MessageData'),
    chatFormat: require('./src/app/helpers/commands/chatFormat'),
    Discord: require('discord.js'),
    youtube: {
        search: require('yt-search'),
        ytdl: require('ytdl-core')
    }
};