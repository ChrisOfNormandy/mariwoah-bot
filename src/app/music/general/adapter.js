playSong = require('./helpers/playSong');
skipSong = require('./helpers/skip');
stopSong = require('./helpers/stop');
joinVC = require('./helpers/join');
leaveVC = require('./helpers/leave');

module.exports = {
    play: function(message) {playSong(message)},
    join: function(message) {joinVC(message)},
    leave: function(message) {leaveVC(message)},
    skip: function(message) {skipSong(message)},
    stop: function(message) {stopSong(message)}
}



