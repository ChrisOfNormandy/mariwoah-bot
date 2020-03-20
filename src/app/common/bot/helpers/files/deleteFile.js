const fs = require('fs');

module.exports = function (path) {
    return new Promise(function (resolve, reject) {
        fs.unlink(path, function (err) {
            if (err)
                reject(err);
            else {
                console.log('File deleted: ', path);
                resolve(true);
            }
        });
    });
}