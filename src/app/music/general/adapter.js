const joinVC = require('./helpers/join');
const leaveVC = require('./helpers/leave');
const listQueue = require('./helpers/getQueue');
const playSong = require('./helpers/playSong');
const removeFromQueue = require('./helpers/removeFromQueue');
const skipSong = require('./helpers/skip');
const stopSong = require('./helpers/stop');

module.exports = {
    join: function(message) {joinVC(message)},
    leave: function(message) {leaveVC(message)},
    listQueue: function(message) {listQueue(message)},
    play: function(message, songURL, songName, vc) {playSong(message, songURL, songName, vc)},
    removeFromQueue: function(message, index) {removeFromQueue(message, index)},
    skip: function(message) {skipSong(message)},
    stop: function(message) {stopSong(message)}
}