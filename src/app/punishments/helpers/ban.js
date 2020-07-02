const db = require('../../sql/adapter');
const embedListing = require('./embedListing');
const messageTarget = require('./messageTarget');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) =>  {
        db.punishments.getUser(message, userID, 'ban')
            .then(data => {
                let list = [];
                for (let i in data)
                    list.push(data[i])
                
                if (listAll)
                    resolve(list);
                else
                    resolve(list[list.length - 1]);
            })
            .catch(e => reject(e));
    })
}

function set(message, userID, reason, duration, severity = 'normal') {
    return new Promise((resolve, reject) => {
        if (!message.guild.members.cache.get(userID))
            resolve(chatFormat.response.punish.no_user());
        else {
            if (reason.trim() == '')
                reason = null;
            else
                reason = reason.trim();

            db.punishments.setUser(message, userID, 'ban', reason, duration, severity);

            get(message, userID)
                .then(data => {
                    messageTarget(message.guild.members.cache.get(userID), message.guild.members.cache.get(message.author.id), message.guild.name, data, { duration });
                    message.guild.members.cache.get(userID).ban({ reason: reason, days: duration });
                    
                    resolve(chatFormat.response.punish.ban(message.guild.members.cache.get(userID), data[data.length - 1].reason,data.length));
                })
                .catch(e => reject(e));
        }
    })
}

function getLatest(message, userID) {
    return get(message, userID, false);
}

function printLatest(message, userID) {
    getLatest(message, userID)
        .then(data => {
            message.channel.send(embedListing.single(message, 'ban', data));
        })
        .catch(e => console.log(e));
}

function printAll(message, userID) {
    get(message, userID, true)
        .then(data => {
            message.channel.send(embedListing.array(message, 'ban', data));
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