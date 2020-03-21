const config = require('../../../../../private/config');
const Discord = require('discord.js');

module.exports = function () {
    console.log('Starting...');
    const client = new Discord.Client();
    client.token = config.auth.token;
    console.log(`Started with client: ${!!client}`);
    return client;
}