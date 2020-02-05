const fs = require('fs');

module.exports = async function(path) {
    return new Promise (function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log('Error when pulling data from file -> getJsonFromFile()')
                reject(err);
            }

            try {
                resolve(JSON.parse(data));
            }
            catch (e) {
                console.log('Failed to pull data from file -> getJsonFromFile() catch')
                reject(e);
            }
        });
    });
}