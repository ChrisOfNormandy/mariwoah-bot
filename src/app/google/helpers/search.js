const config = require('../../../../private/config');
const GoogleImages= require('google-images');
const client = new GoogleImages(config.google.cse_id, config.google.api_key);

function search(data) {
    const string = data.arguments.join(' ');
    return new Promise((resolve, reject) => {
        if (!string)
            reject(string);
        let options = {};

        if (data.parameters.boolean['nsfw'])
            options['safeSearch'] = 'off';

        // console.log(options);

        let promiseArr = [];

        let page = 1;
        // while (page <= 5) {
            options.page = page;
            promiseArr.push(client.search(string, options));
            // page++;
        // }

        Promise.all(promiseArr)
            .then(arr => {
                let images = [];
                for (let index in arr) {
                    for (let i in arr[index])
                        images.push(arr[index][i]);
                }

                resolve(images);
            })
            .catch(e => reject(e));
    });
}

module.exports = search;