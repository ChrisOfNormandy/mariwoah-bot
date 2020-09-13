const ImageScraper = require('bing-image-scraper');
const bing = new ImageScraper();
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

function search(data) {
    let query = data.arguments.join(' ').replace(/[?&:\\/]/g, '');
    // console.log(`Searching Bing for ${query}`);
    // console.log(data);
    return new Promise((resolve, reject) => {
        let searchResults = 10;
        if (data.parameters.integer['results'])
            searchResults = data.parameters.integer['results'];

        // console.log(searchResults);
        bing.list({
            keyword: query,
            num: searchResults,
            nsfw: !!data.flags['n'],
            gif: !!data.flags['g']
        })
        .then((res) => {
            let results = data.parameters.integer['post'] || 1;
            if (results > res.length)
                results = res.length;

            let count = 0;
            let rng = 0;
            let result_arr = [];
            let images = res;

            let timeout = 0;

            while (count < results && timeout < 20) {
                rng = Math.round(Math.random() * res.length) - 1;
                if (images[rng] == null) {
                    timeout++;
                    continue;
                }

                if ((images[rng].url).includes('?')) {
                    images[rng] = null;
                    continue;
                }
                
                result_arr.push(new Discord.MessageAttachment(images[rng].url));
                images[rng] = null;

                count++;
            }

            // console.log(result_arr)

            resolve(commandFormat.valid([res], [{files: result_arr}]))
        })
        .catch(e => reject(commandFormat.error([e], [])));
    });
}

module.exports = search;