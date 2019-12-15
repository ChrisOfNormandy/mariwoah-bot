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

/*
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
    */