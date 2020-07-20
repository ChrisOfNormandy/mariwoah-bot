const db = require('../../../../sql/adapter');

function get(message) {
    db.server.getPrefix(message.guild.id)
        .then(prefix => {
            message.channel.send(`Server prefix: ${prefix}`);
        })
        .catch(e => console.log(e));
}

function set(message, prefix) {
    db.server.setPrefix(message.guild.id, prefix);
    setTimeout(() => get(message), 1000);
}

module.exports = {
    get,
    set
}