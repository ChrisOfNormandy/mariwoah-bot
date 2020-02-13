const fs = require('fs');

module.exports = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, (err, data) => {
            if (err)
                reject(err);
            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                reject(e);
            }
        });
    })
}