const fs = require('fs');
const paths = require('../../../bot/helpers/paths');
const serverMap = require('./serverMap');
const createServerConfig = require('./createServerConfig');
const jsonFileToMap = require('../../../bot/helpers/jsonFileToMap');

async function checkFile(message) {
    return new Promise(function(resolve, reject) {
        fs.access(`${paths.getRoleManagerServerPath(message)}serverData.json`, fs.F_OK, (err) => {
            resolve(!err);
        });
    });
}

module.exports = async function(message) {
    return new Promise(async function(resolve, reject) {
        if (serverMap.map.has(message.channel.guild.id)) resolve(serverMap.map.get(message.channel.guild.id));
        else {
            console.log('Server map does not contain file for the server ' + message.channel.guild.id);

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
                console.log('The file exists though. Adding to the server map.')
                let map = await jsonFileToMap(`${paths.getRoleManagerServerPath(message)}`, `serverData.json`, message.channel.guild.id)
                serverMap.map.set(message.channel.guild.id, map.get(message.channel.guild.id));
                resolve(map.get(message.channel.guild.id));
            }
        }
    })
}