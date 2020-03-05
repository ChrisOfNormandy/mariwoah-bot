const createServerConfig = require('./createServerConfig');
const jsonFileToMap = require('../../../bot/helpers/files/readFileAsMap');
const paths = require('../../../bot/helpers/global/paths');
const serverMap = require('./serverMap');
const fileExists = require('../../../bot/helpers/files/fileExists');
const makeDir = require('../../../bot/helpers/files/makeDir');

module.exports = function (message) {
    return new Promise(function (resolve, reject) {
        if (serverMap.map.has(message.channel.guild.id))
            resolve(serverMap.map.get(message.channel.guild.id));
        else {
            fileExists(`${paths.getRoleManagerServerPath(message)}serverData.json`)
                .then(() => {
                    jsonFileToMap(`${paths.getRoleManagerServerPath(message)}`, `serverData.json`, message.channel.guild.id)
                        .then(map => {
                            serverMap.map.set(message.channel.guild.id, map.get(message.channel.guild.id));
                            resolve(map.get(message.channel.guild.id));
                        })
                        .catch(e => reject(e));
                })
                .catch(() => {
                    makeDir(paths.getRoleManagerServerPath(message));
                    createServerConfig(message)
                        .then(config => {
                            serverMap.map.set(config.id, config);
                            resolve(config);
                        })
                        .catch(e => reject(e));
                });
        }
    });
}