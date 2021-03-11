// const sql = require('../../sql/adapter');
const embedListing = require('./embedListing');
const messageTarget = require('./messageTarget');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) => {
        sql.punishments.getUser(message, userID, 'warn')
            .then(userData => {
                let list = [];
                for (let i in userData)
                    list.push(userData[i])

                if (listAll)
                    resolve(list);
                else
                    resolve(list[list.length - 1]);
            })
            .catch(e => reject(e));
    })
}

function set(message, userID, data) {
    return new Promise((resolve, reject) => {
        if (!message.guild.members.cache.get(userID))
            resolve(chatFormat.response.punish.no_user());
        else {
            let reason = (data.parameters.string['reason'])
                ? data.parameters.string['reason'].trim()
                : 'No reason provided.'

            sql.punishments.setUser(message, userID, 'warn', reason);
            get(message, userID)
                .then(userData => {
                    messageTarget(message.guild.members.cache.get(userID), message.guild.members.cache.get(message.author.id), message.guild.name, userData);
                    resolve({value: chatFormat.response.punish.warn(message.guild.members.cache.get(userID), userData[userData.length - 1].reason, userData.length)});
                })
                .catch(e => reject(e));
        }
    });
}

function printAll(message, userID) {
    return new Promise((resolve, reject) => {
    get(message, userID, true)
        .then(userData => resolve({embed: embedListing.array(message, 'warn', userData)}))
        .catch(e => reject(e));
    });
}

module.exports = {
    get,
    set,
    printAll
}