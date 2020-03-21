const db = require('../../sql/adapter');
const embedListing = require('./embedListing');

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
    if (!message.guild.members.get(userID))
        return message.channel.send('> Could not find target user.');
        
    if (reason.trim() == '')
        reason = null;
    else
        reason = reason.trim();
    db.punishments.setUser(message, userID, 'kick', reason);
    get(message, userID)
        .then(data => {
            messageTarget(message.guild.members.get(userID), message.guild.members.get(message.author.id), message.guild.name, data);
            message.channel.send(`> Kicked ${message.guild.members.get(userID)} for reason: ${data[data.length - 1].reason}\n> Currently has ${data.length} kicks.`);
            message.guild.members.get(userID).kick();
        })
        .catch(e => console.log(e));
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