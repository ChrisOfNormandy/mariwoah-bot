const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const db = require('../../../sql/adapter');

function playlist(message, name) {
    db.playlists.delete(message, name)
        .then(r => console.log(r))
        .catch(e => console.log(e));
}

function song(message, name, songURL) {
    db.playlists.remove(message, name, songURL)
        .then(r => console.log(r))
        .catch(e => console.log(e));
}

module.exports = {
    playlist,
    song
}