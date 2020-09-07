const search = require('./search');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const Discord = require('discord.js');

function post(data) {
    return new Promise((resolve, reject) => {
        search(data)
            .then(images => {
                let rng = Math.floor(Math.random() * (images.length - 1));
                const image = images[rng];
                let image_file = new Discord.MessageAttachment(image.url);

                resolve(commandFormat.valid([image], [{files: [image_file]}]))
            })
            .catch(e => reject(commandFormat.error([e], [])));
    });
}

module.exports = post;