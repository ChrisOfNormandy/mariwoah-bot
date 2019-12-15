const fs = require('fs');

module.exports = function(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                reject(false);
            }
            resolve(JSON.parse(data));
        });
    })
}