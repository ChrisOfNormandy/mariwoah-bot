const serverMap = require('./serverMap');
const createServerConfig = require('./createServerConfig');

module.exports = async function(message) {
    return new Promise(async function(resolve, reject) {
        if (serverMap.map.has(message.channel.guild.id)) resolve(serverMap.map.get(message.channel.guild.id));
        else {
            console.log('Server map does not contain file for the server ' + message.channel.guild.id);

            createServerConfig(message)
            .then(config => {
                serverMap.map.set(config.id, config);
                resolve(config);
            })
            .catch(e => {
                reject(e);
            });
        }
    })
}