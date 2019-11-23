const fs = require('fs');
const mapToJson = require('../../common/bot/helpers/mapToJson');
const minigames = require('../../minigames/core');

module.exports = async function () {
    mapToJson(minigames.stats);
    // return new Promise( function (resolve, reject) {
    //     fs.writeFile('../stats.json', JSON.stringify(stats), (err, data) => {
    //         if (err) {
    //             console.log('Error writing to file' + err);
    //             reject(false);
    //         }
    //         resolve(true);
    //     });
    // });
}