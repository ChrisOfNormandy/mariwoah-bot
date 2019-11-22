// const getQueue = require('../../music/helpers/getQueue');
// const playPlaylist = require('../../music/helpers/playPlaylist');
// const playSong = require('../../music/helpers/playSong');
// const join = require('../../music/helpers/join');
// const createPlaylist = require('../../music/helpers/createPlaylist');
// const listPlaylist = require('../../music/helpers/listPlaylist');

// module.exports = {
//     queue: new Map(),
//     queueContruct: {
//         textChannel: null,
//         voiceChannel: null,
//         connection: null,
//         songs: [],
//         volume: 5,
//         playing: true,
//     },
//     previousSong: null,
//     serverQueue: null,

//     join: function (message) {
//         join(message);
//     },

//     createPlaylist: function (message) {
//         createPlaylist(message);
//     },

//     getMusicQueue: function (message) {
//         getQueue(message);
//     },
    
//     playSong: function (message) {
//         playSong(message);
//     },

//     playPlaylist: function (message) {
//         playPlaylist(message);
//     },

//     skip: function (message) {
//         if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
//         if (!this.serverQueue) return message.channel.send('There is no song that I could skip!');
//         this.serverQueue.connection.dispatcher.end();
//     },
    
//     stop: function (message) {
//         if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
//         this.serverQueue.songs = [];
//         this.serverQueue.connection.dispatcher.end();
//         message.channel.send("Stopping all music.");
//     },
    
//     listPlaylist: function (obj, message, includeLinks) {
//         listPlaylist(obj, message, includeLinks);
//     }
// }