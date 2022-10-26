const append = require('../../queue/append');
// const { s3 } = require('../../../../../helpers/aws');

module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        let name = data.arguments[0];

        s3.object.get('mariwoah', `guilds/${message.guild.id}/playlists/${name}.json`)
            .then(obj => {
                let list = JSON.parse(obj.Body.toString());

                let songs = [];
                for (let s in list) {
                    const song = list[s];
                    songs.push(song);
                }

                append(message, songs, data.flags)
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
};