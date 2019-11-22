const bot = require('./bot/adapter');

module.exports = {
    chatBreak:"-------------------------",
    playlistPath:"./src/music/playlists/",
    client: null,
    bot: bot,
    
    minigames: require('../minigames/core'),
    music: require('../music/core'),

    log: async (string, flag) => bot.printLog(this.client, string, flag),
    
    listHelp: (message) => bot.listHelp(message)
}