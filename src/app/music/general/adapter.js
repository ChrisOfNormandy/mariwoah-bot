const joinVC = require('./helpers/join');
const leaveVC = require('./helpers/leave');
const listQueue = require('./helpers/getQueue');
const playSong = require('./helpers/playSong');
const skipSong = require('./helpers/skip');
const stopSong = require('./helpers/stop');

module.exports = {
    join: function(message) {joinVC(message)},
    leave: function(message) {leaveVC(message)},
    listQueue: function(message) {listQueue(message)},
    play: function(message, songURL, vc) {playSong(message, songURL, vc)},
    skip: function(message) {skipSong(message)},
    stop: function(message) {stopSong(message)}
}