const playSong = require('./helpers/playSong');
const skipSong = require('./helpers/skip');
const stopSong = require('./helpers/stop');
const joinVC = require('./helpers/join');
const leaveVC = require('./helpers/leave');
const listQueue = require('./helpers/getQueue');

module.exports = {
    play: function(message, songURL, vc) {playSong(message, songURL, vc)},
    join: function(message) {joinVC(message)},
    leave: function(message) {leaveVC(message)},
    skip: function(message) {skipSong(message)},
    stop: function(message) {stopSong(message)},
    listQueue: function(message) {listQueue(message)}
}