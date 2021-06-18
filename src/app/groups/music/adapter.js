module.exports = {
    playlist: require('./features/playlist/adapter'),
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