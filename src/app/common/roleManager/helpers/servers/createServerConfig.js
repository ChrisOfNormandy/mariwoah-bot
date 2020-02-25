const writeFile = require('../../../bot/helpers/files/writeFile');
const paths = require('../../../bot/helpers/global/paths');
const newConfig = require('../servers/newConfig');

module.exports = async function (message) {
    let config = newConfig(message);

    return new Promise(function (resolve, reject) {
        writeFile(`${paths.getRoleManagerServerPath(message)}serverData.json`, config)
            .then(r => resolve(r))
            .catch(e => reject(e));
    })
}