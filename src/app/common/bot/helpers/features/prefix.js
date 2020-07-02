const db = require('../../../../sql/adapter');

function get(message) {
    return new Promise((resolve, reject) => {
        db.server.getPrefix(message.guild.id)
            .then(prefix => resolve({value: `Server prefix: ${prefix}`}))
            .catch(e => reject(e));
    })
}

function set(message, prefix) {
    return new Promise((resolve, reject) => {
        db.server.setPrefix(message.guild.id, prefix)
            .then(() => {
                get(message)
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    set
}