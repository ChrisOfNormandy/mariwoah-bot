// const sql = require('../../sql/adapter');
const embedListing = require('./embedListing');
const messageTarget = require('./messageTarget');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) =>  {
        sql.punishments.getUser(message, userID, 'ban')
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
            resolve({value: chatFormat.response.punish.no_user()});
        else {
            if (reason.trim() == '')
                reason = null;
            else
                reason = reason.trim();

            sql.punishments.setUser(message, userID, 'ban', reason, duration, severity);

            get(message, userID)
                .then(data => {
                    messageTarget(message.guild.members.cache.get(userID), message.guild.members.cache.get(message.author.id), message.guild.name, data, { duration });
                    message.guild.members.cache.get(userID).ban({ reason: reason, days: duration });                    
                    resolve({value: chatFormat.response.punish.ban(message.guild.members.cache.get(userID), data[data.length - 1].reason,data.length)});
                })
                .catch(e => reject(e));
        }
    })
}

function printAll(message, userID) {
    return new Promise((resolve, reject) => {
    get(message, userID, true)
        .then(data => resolve({embed: embedListing.array(message, 'ban', data)}))
        .catch(e => reject(e));
    });
}

module.exports = {
    get,
    set,
    printAll
}