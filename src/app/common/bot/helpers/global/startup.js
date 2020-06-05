const db = require('../../../../sql/adapter');
const Discord = require('discord.js');
const config = require('../../../../../../private/config');

let client = new Discord.Client();

function run() {
    db.startup();
    client.login(config.auth.token);
    return client;
}

module.exports = {
    run,
    client
}