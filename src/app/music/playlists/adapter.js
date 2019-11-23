const common = require('../../common/core');
const play = require('./helpers/playPlaylist');

module.exports = {
    play: function(message) {play(message, common.playlistPath)},
}