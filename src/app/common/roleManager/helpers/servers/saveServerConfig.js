const fs = require('fs');
const paths = require('../../../bot/helpers/paths');

let intervalValue = 0;
let saveTimer = false;

module.exports = async function(message, server) {
    intervalValue++;

    return new Promise(function(resolve, reject) {        
        if (saveTimer || intervalValue >= 10) {
            saveTimer = false;
            intervalValue = 0;
            setTimeout(() => saveTimer = true, 300000);

            fs.writeFile(paths.getRoleManagerServerPath(message) + 'serverData.json', JSON.stringify(server), (err) => {
                if (err) {
                    reject(e);
                }
                resolve(true);
            })
        }
        else {
            intervalValue++;
            console.log('Not saving server config to file.', intervalValue);
            resolve(true);
        }
    });
}