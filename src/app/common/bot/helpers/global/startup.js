const db = require('../../../../sql/adapter');
const Discord = require('discord.js');
const config = require('../../../../../../private/config');

module.exports = function () {
    db.startup();
    const client = new Discord.Client();
    client.login(config.auth.token);
    return client;
}