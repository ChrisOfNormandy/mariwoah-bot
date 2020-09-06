const connection = require('../../../../sql/connection');
const Discord = require('discord.js');
const config = require('../../../../../../private/config');

let client = new Discord.Client();

function run() {
    client.login(config.auth.token);
    return client;
}

module.exports = {
    run,
    client
}