const fs = require('fs');
const paths = require('../../../bot/helpers/paths');

module.exports = async function(server) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(paths.roleManagerServers + 'server_' + server.id + '.json', JSON.stringify(server), (err) => {
            if (err) {
                reject(e);
            }
            resolve(true);
        })
    });
}