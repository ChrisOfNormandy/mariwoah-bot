module.exports = {
    queue: new Map(),
    queueContruct: {
        textChannel: null,
        voiceChannel: null,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    },
    previousSong: null,
    serverQueue: null,
}