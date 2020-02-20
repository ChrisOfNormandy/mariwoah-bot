const writeFile = require('../../../bot/helpers/files/writeFile');
const paths = require('../../../bot/helpers/global/paths');

let intervalValue = 0;
let saveTimer = false;

module.exports = async function (message, server) {
    intervalValue++;

    return new Promise(function (resolve, reject) {
        if (saveTimer || intervalValue >= 10) {
            saveTimer = false;
            intervalValue = 0;
            setTimeout(() => saveTimer = true, 300000);
            writeFile(`${paths.getRoleManagerServerPath(message)}serverData.json`, server)
                .then(r => resolve(r))
                .catch(e => reject(e));
        }
        else {
            intervalValue++;
            console.log('Not saving server config to file.', intervalValue);
            resolve(true);
        }
    });
}