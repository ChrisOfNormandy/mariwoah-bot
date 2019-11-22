const cleanChat = require('./helpers/cleanChat');
const divideArray = require('./helpers/divideArray');
const getVoicechat = require('./helpers/getVC');
const listHelp = require('./helpers/listHelp');
const printLog = require('./helpers/printLog');
const startup = require('./helpers/startup');

module.exports = {

    config: require('./helpers/config'),
    help: require('./helpers/help'),

    cleanChat: (message) => cleanChat(message.channel),
    divideArray: async (array, size) => divideArray(array, size),
    getVoicechat: (message) => getVoicechat(message),
    listHelp: (message) => listHelp(message),
    printLog: async (client, string, flag) => printLog(client, string, flag),
    startup: () => startup(),
    
    updateUserObject: (message, object) => updateUserObject(message, object)
}