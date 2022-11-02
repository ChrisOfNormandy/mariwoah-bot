const getSong = require('../../helpers/getSong');

const { spotify } = require('./api');
const { Output } = require('@chrisofnormandy/mariwoah-bot');

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function spotifyToYouTube(data) {
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

                getSong.search(`${data.name} ${data.artists[0].name}`)
                    .then((ytList) => {
                        const video = ytList.videos[0];

                        const url = video.url || `https://www.youtube.com/watch?v=${video.videoId}`;

                        new Output(url).setValues(url).resolve(resolve);
                    })
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
}

module.exports = {
    spotifyToYouTube
};