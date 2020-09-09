const ImageScraper = require('bing-image-scraper');
const bing = new ImageScraper();
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

function search(data) {
    console.log(`Searching Bing for ${data.arguments.join(' ')}`)
    return new Promise((resolve, reject) => {
        let searchResults = 10;
        if (data.parameters.integer['results'])
            searchResults = data.parameters.integer['results'];

        console.log(searchResults);
        bing.list({
            keyword: data.arguments.join(' '),
            num: searchResults,
            nsfw: !!data.flags['n']
        })
        .then((res) => {
            let rng = Math.round(Math.random() * res.length) - 1;
            const image = new Discord.MessageAttachment(res[rng].url)
            resolve(commandFormat.valid([res], [{files: [image]}]))
        })
        .catch(e => reject(commandFormat.error([e], [])));
    });
}

module.exports = search;