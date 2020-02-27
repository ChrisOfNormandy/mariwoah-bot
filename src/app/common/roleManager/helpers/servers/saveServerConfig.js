const writeFile = require('../../../bot/helpers/files/writeFile');
const paths = require('../../../bot/helpers/global/paths');
const serverMap = require('./serverMap');

function saveFile(message, file) {
    writeFile(`${paths.getRoleManagerServerPath(message)}serverData.json`, file)
        .then(() => {
            console.log(`Saved file for ${message.guild.id}.`);
            serverMap.map.set(message.guild.id, file);
            return file;
        })
        .catch(e => {
            console.log(e);
            return null;
        });
}

module.exports = function (message, server) {
    return new Promise(function (resolve, reject) {
        resolve(saveFile(message, server));
    });
}