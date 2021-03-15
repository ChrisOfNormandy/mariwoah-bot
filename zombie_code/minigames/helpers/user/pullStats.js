const fs = require('fs');
const statsPath = require('../../../common/bot/helpers/paths').stats;

module.exports = async function () {
    return new Promise((resolve, reject) =>  {
        fs.readFile(statsPath, function (err, data) {
            if (err)
                reject(err);

            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                reject(e);
            }
        });
    });
}