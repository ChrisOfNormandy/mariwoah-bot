const mapToJson = require('../../../common/bot/helpers/global/mapToJson');
const paths = require('../../../common/bot/helpers/global/paths');
const statsMap = require('./statsMap');
const writeFile = require('../../../common/bot/helpers/file/write');

module.exports = async function () {
    return new Promise((resolve, reject) =>  {
        writeFile(paths.stats, mapToJson(statsMap.map))
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}