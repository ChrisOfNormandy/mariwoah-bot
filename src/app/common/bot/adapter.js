module.exports = {
    features: {
        cleanChat: require('./helpers/features/cleanChat'),
        listHelp: require('./helpers/features/listHelp'),
        motd: require('./helpers/features/motd'),
        ping: require('./helpers/features/ping'),
        prefix: require('./helpers/features/prefix'),
        printLog: require('./helpers/features/printLog'),
        reactions: require('./helpers/features/reactions'),
        roll: require('./helpers/features/roll'),
        whoAre: require('./helpers/features/whoAre'),
        commandLine: require('./helpers/features/commandLine')
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
        commandList: require('./helpers/global/commandList'),
        divideArray: require('./helpers/global/divideArray'),
        getVoiceChannel: require('./helpers/global/getVoiceChannel'),
        intToTimeString: require('./helpers/global/intToTimeString'),
        mapToJson: require('./helpers/global/mapToJson'),
        paths: require('./helpers/global/paths'),
        shuffle: require('./helpers/global/shuffle'),
        startup: require('./helpers/global/startup')
    }
}