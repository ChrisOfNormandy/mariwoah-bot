const playlist = require('./features/playlist/adapter');

module.exports = {
    playlist: (message, data) => {
        switch (data.subcommand) {
            case 'play': return playlist.play(message, data);
            case 'list': return playlist.list(message.guild.id, data.arguments.length ? data.arguments[0] : null);
            case 'create':  return playlist.create(message, data.arguments[0]);
            case 'add': return playlist.addSong(message, data);
            case 'delete': return playlist.delete(message, data);
            case 'remove': return playlist.remove(message, data);
            case 'access': return playlist.setVisibility(message.guild.id, data.arguments[0], !!data.flags['p']);
        }
    },
    queue: {
        skip: require('./features/queue/skip'),
        list: require('./features/queue/list'),
        stop: require('./features/queue/stop'),
        pause: require('./features/queue/pause').pause,
        resume: require('./features/queue/pause').resume,
        add: require('./features/queue/add')
    },
    song: {
        info: require('./features/song/info'),
        download: require('./features/song/download')
    },
    voiceChannel: {
        join: require('./features/voiceChannel/join'),
        leave: require('./features/voiceChannel/leave')
    }
}