// const ImageScraper = require('bing-image-scraper');
// const bing = new ImageScraper();
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

function search(data) {
    let query = data.arguments[0].replace(/[?&:\\/]/g, '');

    return new Promise((resolve, reject) => {
        const Scraper = require('images-scraper');

        const google = new Scraper({
            puppeteer: {
                headless: false
            }
        });

        google.scrape(query, 10)
            .then(res => {
                let resImages = [];
                for (let i in res.length)
                    if (!!res)
                        resImages.push(res[i]);

                console.log(res);

                let results = data.parameters.integer['post'] || 1;
                if (results > resImages.length)
                    results = resImages.length;

                let count = 0;
                let rng = 0;
                let result_arr = [];
                let images = resImages;

                let timeout = 0;

                while (count < results && timeout < 20) {
                    rng = Math.round(Math.random() * resImages.length) - 1;
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

                resolve(commandFormat.valid([res], [{files: result_arr}]))
            })
            .catch(err => reject(commandFormat.error([err], [])));
    });
}

module.exports = search;