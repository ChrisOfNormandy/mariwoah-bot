const getQueue = require('./helpers/getQueue');
const playPlaylist = require('./helpers/playPlaylist');
const playSong = require('./helpers/playSong');
const join = require('./helpers/join');
const createPlaylist = require('./helpers/createPlaylist');
const listPlaylist = require('./helpers/listPlaylist');

module.exports = {
    queue: new Map(),
    queueContruct: {
        textChannel: null,
        voiceChannel: null,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    },
    previousSong: null,
    serverQueue: null,

    join: function (message) {
        join(message);
    },

    createPlaylist: function (message) {
        createPlaylist(message);
    },

    getMusicQueue: function (message) {
        getQueue(message);
    },
    
    playSong: function (message) {
        playSong(message);
    },

    playPlaylist: function (message) {
        playPlaylist(message);
    },

    skip: function (message) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!this.serverQueue) return message.channel.send('There is no song that I could skip!');
        this.serverQueue.connection.dispatcher.end();
    },
    
    stop: function (message) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        this.serverQueue.songs = [];
        this.serverQueue.connection.dispatcher.end();
        message.channel.send("Stopping all music.");
    },
    
    listPlaylist: function (obj, message, includeLinks) {
        listPlaylist(obj, message, includeLinks);
    }
}