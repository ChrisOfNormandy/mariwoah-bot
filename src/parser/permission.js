const adapter = require('../app/adapter');

function verify(message, properties, data, command) {
    return new Promise((resolve, reject) => {
        adapter.rolemanagement.verifyPermission(message, message.author.id, properties.permissionLevel)
            .then(r => {
                resolve({
                    command,
                    permission: r,
                    properties,
                    data
                });
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    verify
}