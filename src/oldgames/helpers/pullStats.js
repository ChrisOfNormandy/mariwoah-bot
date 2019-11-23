const global = require('../../main/global');
const fs = require('fs');
const statsPath = require('./paths').statsPath;

module.exports = async function () {
    global.log('Executing pullStats.', 'info');
    
    return new Promise (function (resolve, reject) {
        fs.readFile(statsPath, function (err, data) {
            if (err) {
                console.log('Error when pulling data from stats file.')
                console.log(err);
                reject(false);
            }

            try {
                let obj = JSON.parse(data);
                resolve(obj);
            }
            catch (e) {
                console.log('Failed to pull data from stats file.')
                console.log(e);
                reject(false);
            }
        });
    });
}