const Discord = require('discord.js');
const config = require('./config');

module.exports = function () {
    const client = new Discord.Client();
    client.token = config.auth.token;

    return client;
}