const getSong = require('../../helpers/getSong');

const { spotify } = require('./api');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { MessageEmbed } = handlers.embed;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function getTrack(data) {
    let id = null;

    if (data.urls[0]) {
        const m = data.urls[0].match(/track\/([^?]+)/);

        if (m)
            id = m[1];
    }
    else
        id = data.arguments[0];

    if (!id)
        return new Output().makeError('Failed to get track ID.').reject();

    return new Promise((resolve, reject) => {
        spotify(`/tracks/${id}`)
            .then((response) => {
                const { data } = response;

                const embed = new MessageEmbed()
                    .setTitle(data.name);

                if (data.album && data.album.images && data.album.images[0])
                    embed.makeThumbnail(data.album.images[0].url);

                getSong.search(`${data.name} ${data.artists[0].name}`)
                    .then((ytList) => {
                        const video = ytList.videos[0];

                        embed.makeField(
                            `Track: ${data.name}`,
                            `Spotify: ${data.external_urls.spotify}\nYouTube: ${video.url || `https://www.youtube.com/watch?v=${video.videoId}`}`
                        );

                        new Output().setValues(data).addEmbed(embed).resolve(resolve);
                    })
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function findTrack(data) {
    return new Promise((resolve, reject) => {
        spotify(`/search?type=track&q=${data.arguments[0].replace(/\s/g, '+')}`)
            .then((response) => {
                const embed = new MessageEmbed()
                    .setTitle('Search Results');

                response.data.tracks.items.slice(0, 10).forEach((track) => {
                    embed.makeField(
                        `${track.name} | ${track.artists[0].name}`,
                        `Album: ${track.album.name}\n${track.external_urls.spotify}`
                    );
                });

                const value = data.flags.has('s')
                    ? response.data.tracks.items[0].external_urls.spotify
                    : response.data.tracks;

                new Output().setValues(value).addEmbed(embed).resolve(resolve);
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

module.exports = {
    getTrack,
    findTrack
};