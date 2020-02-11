const bot = require('./bot/adapter');

module.exports = {
    client: bot.preStartup(),
    bot: bot,
    config: bot.config,
    
    minigames: require('../minigames/core'),
    music: require('../music/core'),
    memes: require('../memes/core'),
    roleManager: require('./roleManager/adapter'),
    dungeons: require('../dungeons/core'),

    log: async function(string, flag) {bot.printLog(this.client, string, flag);},
    
    listHelp: (message) => bot.listHelp(message),

    roll: async function(message, args) {bot.roll(message, args);}
}