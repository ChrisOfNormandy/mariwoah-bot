const mapToJson = require('../../../common/bot/helpers/global/mapToJson');
const paths = require('../../../common/bot/helpers/global/paths');
const statsMap = require('./statsMap');
const writeFile = require('../../../common/bot/helpers/files/writeFile');

module.exports = async function () {
    return new Promise(function (resolve, reject) {
        writeFile(paths.stats, mapToJson(statsMap.map))
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}