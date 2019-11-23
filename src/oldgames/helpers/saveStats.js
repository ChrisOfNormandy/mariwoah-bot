const gaming = require('../gaming');
const pushStats = require('./pushStats');

module.exports = async function () {
    return new Promise (function (resolve, reject) {
        try {
            if (gaming.stats === null) {
                reject(gaming.stats);
                return;
            }
            pushStats(gaming.stats);
            resolve(true);
        }
        catch (e) {
            console.log(e);
            reject(false);
        }
    })
}