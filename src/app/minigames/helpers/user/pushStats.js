const fs = require('fs');
const mapToJson = require('../../../common/bot/helpers/mapToJson');
const paths = require('../../../common/bot/helpers/paths');
const statsMap = require('./statsMap');

module.exports = async function () {
    let stats = mapToJson(statsMap.map);
    return new Promise( function (resolve, reject) {
        fs.writeFile(paths.stats, JSON.stringify(stats), (err, data) => {
            if (err) {
                console.log('Error writing to file' + err);
                reject(false);
            }
            console.log('Saved stats to file successfully.');
            resolve(true);
        });
    });
}