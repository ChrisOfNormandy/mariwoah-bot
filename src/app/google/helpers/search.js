const config = require('../../../../private/config');
const GoogleImages= require('google-images');
const client = new GoogleImages(config.imgur.cse_id, config.imgur.api_key);

function search(data) {
    const string = data.arguments.join(' ');
    return new Promise((resolve, reject) => {
        if (!string)
            reject(string);
        client.search(string)
            .then(images => resolve(images))
            .catch(e => reject(e));
    });
}

module.exports = search;