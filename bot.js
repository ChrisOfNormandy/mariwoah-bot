const { v4 } = require('uuid');
const commands = require('./src/commands');
const config = require('./config/config.json');

const { existsSync } = require('fs');

const { Bot, handlers, Discord } = require('@chrisofnormandy/mariwoah-bot');

const startupConfig = {
    devEnabled: true
};

let onStartup = () => console.log('Ready!');

if (existsSync(__dirname + '/config/tables.json') && process.argv.includes('use-db')) {
    startupConfig.databaseTables = require('./config/tables.json');
    startupConfig.resetDatabase = process.argv.includes('reset-db');

    onStartup = () => {
        handlers.database.add('playlists', {
            playlist_id: v4().replace(/-/g, ''),
            name: 'Test Playlist',
            guild_created_at: '488500539651391489',
            user_created_at: '188020615989428224',
            created_timestamp: Math.floor(Date.now() / 1000)
        })
            .then((r) => console.log(r))
            .catch((err) => console.error(err));
    };
}

const bot = new Bot(config)
    .allow(
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMembers
    )
    .addCommands(commands);

bot
    .startup(startupConfig)
    .then((bot) => bot.setStatus('%guild_count% servers | %prefix%?'))
    .catch(console.error)
    .then(onStartup);