const cleanChat = require('./helpers/cleanChat');
const divideArray = require('./helpers/divideArray');
const getVoicechat = require('./helpers/getVC');
const listHelp = require('./helpers/listHelp');
const ping = require('./helpers/ping');
const preStartup = require('./helpers/preStartup');
const printLog = require('./helpers/printLog');
const reactions = require('./helpers/reactions');
const startup = require('./helpers/startup');

module.exports = {

    config: require('./helpers/config'),
    help: require('./helpers/help'),

    cleanChat: (message) => cleanChat(message.channel),
    divideArray: async (array, size) => divideArray(array, size),
    getVoicechat: (message) => getVoicechat(message),
    listHelp: (message) => listHelp(message),
    ping: (message, client) => ping(message, client),
    preStartup: () => preStartup(),
    printLog: async (client, string, flag) => printLog(client, string, flag),
    reactions: (message) => reactions(message),
    startup: () => startup(),
    whoami: (message) => {
        let m = message.member;
        let u = m.user;
        let date = new Date(m.joinedTimestamp);
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let joinDate = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`

        let roles = '';
        for (role in m._roles) {
            roles += `${message.guild.roles.get(m._roles[role]).name}`
            roles += (m._roles.length > 1 && role < m._roles.length - 1) ? ', ' : '';
        }

        let msg =
        '```js\n' +
        `"Name": ${u.username}#${u.discriminator}\n` +
        `Joined ${joinDate}\n` +
        `"Roles": ${(roles != '') ? roles : 'None'}\n` +
        '```';

        message.channel.send(msg);
    },
    whoareyou: (message) => {
        let id = message.mentions.users.first().id;
        let user = message.guild.members.get(id);
        console.log(user);
        let u = user.user;

        let date = new Date(user.joinedTimestamp);
        let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let joinDate = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`

        let roles = '';
        for (role in user._roles) {
            roles += `${user.guild.roles.get(user._roles[role]).name}`
            roles += (user._roles.length > 1 && role < user._roles.length - 1) ? ', ' : '';
        }

        let msg =
        '```js\n' +
        `"Name": ${u.username}#${u.discriminator}\n` +
        `Joined ${joinDate}\n` +
        `"Roles": ${(roles != '') ? roles : 'None'}\n` +
        '```';

        message.channel.send(msg);
    }
}