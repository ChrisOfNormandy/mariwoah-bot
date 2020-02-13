const createServerConfig = require('./createServerConfig');
const fs = require('fs');
const jsonFileToMap = require('../../../bot/helpers/jsonFileToMap');
const paths = require('../../../bot/helpers/paths');
const serverMap = require('./serverMap');

async function checkFile(message) {
    return new Promise(function (resolve, reject) {
        fs.access(`${paths.getRoleManagerServerPath(message)}serverData.json`, fs.F_OK, (err) => {
            if (err)
                reject(err);
            resolve(true);
        });
    });
}

module.exports = async function (message) {
    return new Promise(async function (resolve, reject) {
        if (serverMap.map.has(message.channel.guild.id))
            resolve(serverMap.map.get(message.channel.guild.id));
        else {
            let exists = await checkFile(message);
            if (!exists) {
                createServerConfig(message)
                    .then(config => {
                        serverMap.map.set(config.id, config);
                        resolve(config);
                    })
                    .catch(e => {
                        reject(e);
                    });
            }
            else {
                let map = await jsonFileToMap(`${paths.getRoleManagerServerPath(message)}`, `serverData.json`, message.channel.guild.id)
                serverMap.map.set(message.channel.guild.id, map.get(message.channel.guild.id));
                resolve(map.get(message.channel.guild.id));
            }
        }
    })
}