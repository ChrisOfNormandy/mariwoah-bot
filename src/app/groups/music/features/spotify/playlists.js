const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const getSong = require('../../helpers/getSong');
const { MessageEmbed } = handlers.embed;
const { spotify } = require('./api');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function getPlaylist(data) {
    let id = null;
    if (data.urls[0]) {
        const m = data.urls[0].match(/playlist\/([^?]+)/);

        if (m)
            id = m[1];
    }
    else
        id = data.arguments[0];

    if (!id)
        return Promise.reject(new Output().setError(new Error('Failed to get playlist ID.')));

    let offset = data.arguments[1] || 0;

    return new Promise((resolve, reject) => {
        spotify(`/playlists/${id}/tracks?offset=${offset}&limit=10`)
            .then((response) => {
                const { data } = response;

                const embed = new MessageEmbed()
                    .setTitle(data.name);

                if (data.owner)
                    embed.setDescription(`Owner: ${data.owner.display_name} | Public: ${!!data.public}`);

                if (data.external_urls)
                    embed.setURL(data.external_urls.spotify);

                if (data.images && data.images[0])
                    embed.makeThumbnail(data.images[0].url);

                const tracks = data.tracks
                    ? data.tracks.items.slice(0, 10)
                    : data.items.slice(0, 10);

                Promise.all(tracks.map((item) => getSong.search(`${item.track.name} ${item.track.artists[0].name}`)))
                    .then((ytList) => {
                        tracks.forEach((item, i) => {
                            const video = ytList[i].videos[0];

                            embed.makeField(
                                `Track ${i + 1}: ${item.track.name}`,
                                `Spotify: ${item.track.external_urls.spotify}\nYouTube: ${video.url || `https://www.youtube.com/watch?v=${video.videoId}`}`
                            );
                        });

                        new Output().addEmbed(embed).resolve(resolve);
                    })
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

module.exports = {
    getPlaylist
};