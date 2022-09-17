const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const getSong = require('../../helpers/getSong');
const { MessageEmbed } = handlers.embed;
const { spotify } = require('./api');

/**
 * 
 * @param {import('@chrisofnormandy/mariwoah-bot').Discord.Message} message 
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data 
 * @returns 
 */
function getPlaylist(message, data) {
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

    console.log('Spotify playlist ID:', id);

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

                        resolve(new Output().addEmbed(embed));
                    })
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {import('@chrisofnormandy/mariwoah-bot').Discord.Message} message 
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data 
 * @returns 
 */
function getTrack(message, data) {
    let id = null;
    if (data.urls[0]) {
        const m = data.urls[0].match(/track\/([^?]+)/);

        if (m)
            id = m[1];
    }
    else
        id = data.arguments[0];

    if (!id)
        return Promise.reject(new Output().setError(new Error('Failed to get track ID.')));

    console.log('Spotify track ID:', id);

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

                        resolve(new Output().addEmbed(embed));
                    })
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {import('@chrisofnormandy/mariwoah-bot').Discord.Message} message 
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data 
 * @returns 
 */
function findTrack(message, data) {
    return new Promise((resolve, reject) => {
        spotify(`/search?type=track&q=${data.arguments[0].replace(/\s/g, '+')}`)
            .then((response) => {
                const { data } = response;

                const embed = new MessageEmbed()
                    .setTitle('Search Results');

                data.tracks.items.slice(0, 10).forEach((track) => {
                    console.log(track);
                    embed.makeField(
                        `${track.name} | ${track.artists[0].name}`,
                        `Album: ${track.album.name}\n${track.external_urls.spotify}`
                    );
                });

                resolve(new Output().addEmbed(embed));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
}

function spotifyToYouTube(message, data) {
    let id = null;
    if (data.urls[0]) {
        const m = data.urls[0].match(/track\/([^?]+)/);

        if (m)
            id = m[1];
    }
    else
        id = data.arguments[0];

    if (!id)
        return Promise.reject(new Output().setError(new Error('Failed to get track ID.')));

    console.log('Spotify track ID:', id);

    return new Promise((resolve, reject) => {
        spotify(`/tracks/${id}`)
            .then((response) => {
                const { data } = response;

                getSong.search(`${data.name} ${data.artists[0].name}`)
                    .then((ytList) => {
                        const video = ytList.videos[0];

                        const url = video.url || `https://www.youtube.com/watch?v=${video.videoId}`;

                        resolve(new Output(url).setValues(url));
                    })
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
}

module.exports = {
    getPlaylist,
    getTrack,
    findTrack,
    spotifyToYouTube
};