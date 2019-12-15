const bot = require('./bot/adapter');

module.exports = {
    client: bot.preStartup(),
    bot: bot,
    config: bot.config,
    
    minigames: require('../minigames/core'),
    music: require('../music/core'),
    memes: require('../memes/core'),

    log: async function(string, flag) {bot.printLog(this.client, string, flag);},
    
    listHelp: (message) => bot.listHelp(message)
}