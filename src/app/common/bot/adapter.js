const cleanChat = require('./helpers/cleanChat');
const divideArray = require('./helpers/divideArray');
const getVoicechat = require('./helpers/getVC');
const listHelp = require('./helpers/listHelp');
const ping = require('./helpers/ping');
const preStartup = require('./helpers/preStartup');
const printLog = require('./helpers/printLog');
const reactions = require('./helpers/reactions');
const startup = require('./helpers/startup');
const whoAre = require('./helpers/whoAre');

module.exports = {

    config: require('./helpers/config'),
    help: require('./helpers/help'),

    cleanChat: (message) => cleanChat(message),
    divideArray: async (array, size) => divideArray(array, size),
    getVoicechat: (message) => getVoicechat(message),
    listHelp: (message) => listHelp(message),
    ping: (message, client) => ping(message, client),
    preStartup: () => preStartup(),
    printLog: async (client, string, flag) => printLog(client, string, flag),
    reactions: (message) => reactions(message),
    startup: () => startup(),
    whoami: (message) => whoAre.self(message),
    whoareyou: (message) => whoAre.member(message)
}