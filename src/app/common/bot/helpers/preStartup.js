const Discord = require('discord.js');
const config = require('./config');

module.exports = function () {
    console.log('Creating new Discord client.');
    const client = new Discord.Client();
    client.token = config.auth.token;
    console.log((client) ? 'Done!' : 'Uh oh...');
    return client;
}