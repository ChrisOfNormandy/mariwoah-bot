const db = require('../../sql/adapter');
const embedListing = require('./embedListing');

function get(message, userID, listAll = true) {
    return new Promise((resolve, reject) =>  {
        db.punishments.getUser(message, userID, 'warn')
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

function set(message, userID, reason = null) {
    db.punishments.setUser(message, userID, 'warn', reason)
}

function getLatest(message, userID) {
    return get(message, userID, false);
}

function printLatest(message, userID) {
    getLatest(message, userID)
        .then(data => {
            message.channel.send(embedListing.single(message, 'warn', data));
        })
        .catch(e => console.log(e));
}

function printAll(message, userID) {
    get(message, userID, true)
        .then(data => {
            message.channel.send(embedListing.array(message, 'warn', data));
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