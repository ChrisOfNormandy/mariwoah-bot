const pullStats = require('./pullStats');
const restartTimers = require('./restartTimers');

module.exports = async function () { 
    return new Promise (function (resolve, reject) {
        pullStats()
        .then(stats => {
            if (stats) {
                try {
                    let newstats = restartTimers(stats);
                    console.log('Restarted timers.');
                    resolve(newstats);
                }
                catch (e) {
                    console.log(e);
                    console.log('Cannot restart timers, because there is nothing to restart.');
                    reject(false);
                }
            }
            else reject(false);
        })
        .catch(e => {
            console.log(e);
            reject(false);
        });
    })
}