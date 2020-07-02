const db = require('../../sql/adapter');
const embedListing = require('./embedListing');
const messageTarget = require('./messageTarget');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) =>  {
        db.punishments.getUser(message, userID, 'kick')
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

function set(message, userID, reason) {
    return new Promise((resolve, reject) => {
        if (!message.guild.members.cache.get(userID))
            resolve(message.channel.send(chatFormat.response.punish.no_user()));
        else {
            if (reason.trim() == '')
                reason = null;
            else
                reason = reason.trim();
            db.punishments.setUser(message, userID, 'kick', reason);
            get(message, userID)
                .then(data => {
                    messageTarget(message.guild.members.cache.get(userID), message.guild.members.cache.get(message.author.id), message.guild.name, data);
                    message.guild.members.cache.get(userID).kick();
                    resolve(chatFormat.response.punish.kick(message.guild.members.cache.get(userID), data[data.length - 1].reason,data.length));
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
        .then(data => {
            message.channel.send(embedListing.single(message, 'kick', data));
        })
        .catch(e => console.log(e));
}

function printAll(message, userID) {
    get(message, userID, true)
        .then(data => {
            message.channel.send(embedListing.array(message, 'kick', data));
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