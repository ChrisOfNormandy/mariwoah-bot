const csvToMap = require('./csvToMap');
const equipmentMap = require('./equipmentMap');

function check(itemName) {
    for (c in equipmentMap.map) {
        if (equipmentMap.map[c][itemName])
            return equipmentMap.map[c][itemName];
    }
    return null;
}

module.exports = async function(itemName) {
    return new Promise(function(resolve, reject) {
        if (equipmentMap.map.size <= 1) {
            csvToMap().then(map => {
                equipmentMap.map = map;
                
                let val = check(itemName);
                console.log(val);
                if (val == null)
                    reject(val);
                else
                    resolve(val);
            });
        }
        else {
            let val = check(itemName);
            if (val == null)
                reject(val);
            else
                resolve(val);
        }
    });
}