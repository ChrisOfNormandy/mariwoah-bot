const csvToMap = require('./csvToMap');
const equipmentMap = require('./equipmentMap');

function check(className) {
    if (equipmentMap.map[className])
        return equipmentMap.map[className];

    return null;
}

module.exports = async function (className) {
    return new Promise(function (resolve, reject) {
        let val;
        if (equipmentMap.map.size <= 1) {
            csvToMap().then(map => {
                equipmentMap.map = map;

                val = check(className);
                if (val == null)
                    reject(val);
                else
                    resolve(val);
            });
        }
        else {
            val = check(className);
            if (val == null)
                reject(val);
            else
                resolve(val);
        }
    });
}