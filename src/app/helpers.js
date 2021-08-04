module.exports = {
    filter: {
        getChat: require('./helpers/filter/getChat'),
        getName: require('./helpers/filter/getName')
    },
    chatFilter: require('./helpers/chatFilter'),
    commands: require('./helpers/commands'),
    divideArray: require('./helpers/divideArray'),
    getAge: require('./helpers/getAge'),
    getVoiceChannel: require('./helpers/getVoiceChannel'),
    intToTimeString: require('./helpers/intToTimeString'),
    mapToJson: require('./helpers/mapToJson'),
    nameFilter: require('./helpers/nameFilter'),
    shuffle: require('./helpers/shuffle')
};