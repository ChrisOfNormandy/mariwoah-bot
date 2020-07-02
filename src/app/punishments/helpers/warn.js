const db = require('../../sql/adapter');
const embedListing = require('./embedListing');
const messageTarget = require('./messageTarget');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) => {
        db.punishments.getUser(message, userID, 'warn')
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

            db.punishments.setUser(message, userID, 'warn', reason);
            get(message, userID)
                .then(userData => {
                    messageTarget(message.guild.members.cache.get(userID), message.guild.members.cache.get(message.author.id), message.guild.name, userData);
                    resolve(chatFormat.response.punish.warn(message.guild.members.cache.get(userID), userData[userData.length - 1].reason, userData.length));
                })
                .catch(e => reject(e));
        }
    });
}

function getLatest(message, userID) {
    return get(message, userID, false);
}

function printLatest(message, userID) {
    getLatest(message, userID)
        .then(userData => {
            message.channel.send(embedListing.single(message, 'warn', userData));
        })
        .catch(e => console.log(e));
}

function printAll(message, userID) {
    get(message, userID, true)
        .then(userData => {
            message.channel.send(embedListing.array(message, 'warn', userData));
        })
        .catch(e => console.log(e));
}

module.exports = {
    get,
    set,
    getLatest,
    printLatest,
    printAll
}