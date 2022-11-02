module.exports = {
    playlist: require('./features/playlist/adapter'),
    queue: {
        skip: require('./features/queue/skip'),
        list: require('./features/queue/list'),
        loop: require('./features/queue/loop'),
        stop: require('./features/queue/stop'),
        ...require('./features/queue/pause'),
        add: require('./features/queue/add')
    },
    song: {
        info: require('./features/song/info'),
        download: require('./features/song/download')
    },
    voiceChannel: {
        join: require('./features/voiceChannel/join'),
        leave: require('./features/voiceChannel/leave')
    },
    spotify: {
        ...require('./features/spotify/adapter')
    }
};