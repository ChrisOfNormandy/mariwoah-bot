const cleanChat = require('./helpers/features/cleanChat');
const covid = require('./helpers/features/covid19');
const divideArray = require('./helpers/global/divideArray');
const getVoiceChannel = require('./helpers/global/getVoiceChannel');
const listHelp = require('./helpers/features/listHelp');
const ping = require('./helpers/features/ping');
const preInit = require('./helpers/preInit');
const printLog = require('./helpers/printLog');
const reactions = require('./helpers/features/reactions');
const roll = require('./helpers/features/roll');
const shuffle = require('./helpers/global/shuffle');
const init = require('./helpers/init');
const whoAre = require('./helpers/features/whoAre');

module.exports = {

    config: require('../../../../private/config'),
    help: require('./helpers/global/commandList'),

    cleanChat: (message) => cleanChat(message),
    covid: (message) => covid(message),
    divideArray: async (array, size) => divideArray(array, size),
    getVoiceChannel: (message) => getVoiceChannel(message),
    listHelp: (message, args) => listHelp(message, args),
    ping: (message, client) => ping(message, client),
    preInit: () => preInit(),
    printLog: async (client, string, flag) => printLog(client, string, flag),
    reactions: (message) => reactions(message),
    roll: async (message, args) => roll(message, args),
    shuffle: async (message, array) => { shuffle(array).then(r => message.channel.send(r.join(', '))) },
    init: () => init(),
    whoami: (message) => whoAre.self(message),
    whoareyou: (message) => whoAre.member(message)
}