const config = require('./config');
const Discord = require('discord.js');

module.exports = function () {
    const client = new Discord.Client();
    client.token = config.auth.token;
    return client;
}