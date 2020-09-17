const imgur = require('imgur');
const config = require('../../../../private/config');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

imgur.setClientId(config.imgur.clientId);

function search(data) {
    const query = data.arguments.join(' ');
    const optionalParams = {sort: 'top', dateRange: 'all', page: 1};

    return new Promise((resolve, reject) => {
        imgur.search(query, optionalParams)
            .then(json => {
                let imagesArr = [];

                let rng = Math.round(Math.random() * (json.data.length - 1));

                const image = json.data[rng];

                if (image.images) {
                    if (data.flags['a']) {
                        for (let i in image.images)
                            imagesArr.push({files: [new Discord.MessageAttachment(image.images[i].link)]});
                    }
                    else
                        imagesArr.push({files: [new Discord.MessageAttachment(image.images[0].link)]})
                }
                else                    
                    imagesArr.push({files: [new Discord.MessageAttachment(image.link)]});

                resolve(commandFormat.valid([json], imagesArr));
            })
            .catch(e => reject(e));
    });
}

module.exports = search;