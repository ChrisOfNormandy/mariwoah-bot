const search = require('./search');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

function post(data) {
    return new Promise((resolve, reject) => {
        search(data)
            .then(images => { 
                let imagesArr = [];
                let rng = 0;

                for (let i = 0; i < 5; i++) {
                    // rng = Math.floor(Math.random() * (images.length - 1));
                    rng = i;
                    imagesArr.push({files: [new Discord.MessageAttachment(images[rng].url)]});
                }

                resolve(commandFormat.valid(images, imagesArr))
            })
            .catch(e => {
                console.log('ERROR', e);
                if (e.statusCode == 429)   
                    reject(commandFormat.error([e], [`The bot's reached its search quota for the day. Please try again tomorrow. Sorry :(`]));
                else
                    reject(commandFormat.error([e], []));
            });
    });
}

module.exports = post;