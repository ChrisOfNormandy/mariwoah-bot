const music = require('./general/adapter');
const playlist = require('./playlists/adapter');

module.exports = {
    play: function(message) {music.play(message)},
    join: function(message) {music.join(message)},
    leave: function(message) {music.leave(message)},
    skip: function(message) {music.skip(message)},
    stop: function(message) {music.stop(message)},

    playPlaylist: function(message) {playlist.play(message)},

    playlistCommand: function(message, commandList) {     
        console.log(commandList);  
        switch(commandList[0]) {
            case 'play': this.playPlaylist(message);
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