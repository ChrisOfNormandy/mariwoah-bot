const db = require('../../../../sql/adapter');

function get(message) {
    return new Promise((resolve, reject) => {
        db.server.getPrefix(message.guild.id)
            .then(prefix => resolve(`Server prefix: ${prefix}`))
            .catch(e => reject(e));
    })
}

function set(message, prefix) {
    return new Promise((resolve, reject) => {
        db.server.setPrefix(message.guild.id, prefix)
            .then(() => resolve(get(message)))
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    set
}