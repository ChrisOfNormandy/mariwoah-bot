const global = require('../../main/global');
const fs = require('fs');
const statsPath = require('./paths').statsPath;

module.exports = async function (stats) {
    global.log('Executing pushStats.', 'info');

    return new Promise( function (resolve, reject) {
        fs.writeFile(statsPath, JSON.stringify(stats), (err, data) => {
            if (err) {
                console.log('Error writing to file' + err);
                reject(false);
            }
            resolve(true);
        });
    });
}