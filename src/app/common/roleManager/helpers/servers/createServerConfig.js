const writeFile = require('../../../bot/helpers/files/writeFile');
const paths = require('../../../bot/helpers/global/paths');
const newConfig = require('../servers/newConfig');

module.exports = async function (message) {
    return new Promise(function (resolve, reject) {
        let config = newConfig(message);
        writeFile(`${paths.getRoleManagerServerPath(message)}serverData.json`, config)
            .then(r => resolve(config))
            .catch(e => reject(e));
    })
}