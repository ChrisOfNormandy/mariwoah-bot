module.exports = {
    features: {
        cleanChat: require('./helpers/features/cleanChat'),
        fetchEmoji: require('./helpers/features/fetchEmoji'),
        listHelp: require('./helpers/features/listHelp'),
        motd: require('./helpers/features/motd'),
        ping: require('./helpers/features/ping'),
        prefix: require('./helpers/features/prefix'),
        roll: require('./helpers/features/roll'),
        whoAre: require('./helpers/features/whoAre'),
    },
    file: {
        delete: require('./helpers/file/delete'),
        exists: require('./helpers/file/exists'),
        listDir: require('./helpers/file/listDir'),
        makeDir: require('./helpers/file/makeDir'),
        read: require('./helpers/file/read'),
        readAsMap: require('./helpers/file/readAsMap'),
        write: require('./helpers/file/write')
    },
    global: {
        chatFormat: require('./helpers/global/chatFormat'),
        divideArray: require('./helpers/global/divideArray'),
        getAge: require('./helpers/global/getAge'),
        getVoiceChannel: require('./helpers/global/getVoiceChannel'),
        intToTimeString: require('./helpers/global/intToTimeString'),
        mapToJson: require('./helpers/global/mapToJson'),
        noise: require('./helpers/global/noise'),
        shuffle: require('./helpers/global/shuffle'),
        startup: require('./helpers/global/startup')
    }
}