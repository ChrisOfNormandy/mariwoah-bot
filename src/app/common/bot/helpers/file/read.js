const fs = require('fs');

module.exports = function (path) {
    return new Promise((resolve, reject) =>  {
        fs.readFile(path, (err, data) => {
            if (err)
                reject(err);
            else {
                try {
                    if (!data)
                        resolve(null);
                    else
                        resolve(JSON.parse(data));
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    });
}