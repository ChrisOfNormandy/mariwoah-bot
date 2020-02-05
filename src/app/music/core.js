const music = require('./general/adapter');
const playlist = require('./playlists/adapter');

module.exports = {
    play: function(message) {music.play(message)},
    join: function(message) {music.join(message)},
    leave: function(message) {music.leave(message)},
    skip: function(message) {music.skip(message)},
    stop: function(message) {music.stop(message)},
    listQueue: function(message) {music.listQueue(message)},

    playPlaylist: function(message) {playlist.play(message)},
    listPlaylist: function(message) {playlist.list(message)},
    listAllPlaylists: function(message) {playlist.listAll(message)},
    createPlaylist: function(message) {playlist.create(message)},
    addToPlaylist: function(message) {playlist.add(message)},
    removeFromPlaylist: function(message) {playlist.remove(message)},

    playlistCommand: function(message, commandList) {
        switch(commandList[0]) {
            case 'play': {this.playPlaylist(message); break;}
            case 'list': {
                if (commandList.length == 1) this.listAllPlaylists(message);
                else this.listPlaylist(message); break;
            }
            case 'create': {this.createPlaylist(message); break;}
            case 'add': {this.addToPlaylist(message); break;}
            case 'remove': {this.removeFromPlaylist(message); break;}
        }
    }
}