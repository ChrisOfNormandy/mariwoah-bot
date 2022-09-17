const axios = require('axios').default;
const { stringify } = require('querystring');
const config = require('../../../../../../config/spotify.json');

let token = {
    access_token: '',
    token_type: 'Bearer',
    expires_in: 0
};

let tokenExpires = Date.now();

/**
 * @typedef {token} SpotifyToken
 */

/**
 * 
 * @returns {Promise<SpotifyToken>}
 */
function login() {
    if (Date.now() < tokenExpires)
        return Promise.resolve(token);

    let url = 'https://accounts.spotify.com';

    const code = Buffer.from(`${config.client_id}:${config.secret}`).toString('base64');

    return new Promise((resolve, reject) => {
        axios.post(
            `${url}/api/token`,
            stringify(
                {
                    grant_type: 'client_credentials'
                }
            ),
            {
                headers: {
                    'Authorization': `Basic ${code}`
                }
            }
        )
            .then((response) => {
                token = response.data;
                tokenExpires = Date.now() + token.expires_in * 1000;
                resolve(token);
            })
            .catch(reject);
    });
}

function getToken() {
    return login();
}

function getAccessToken() {
    return new Promise((resolve, reject) => {
        getToken()
            .then((token) => resolve(`Bearer ${token.access_token}`))
            .catch(reject);
    });
}

function spotify(url) {
    return new Promise((resolve, reject) => {
        getAccessToken()
            .then((token) => {
                axios.get(
                    `https://api.spotify.com/v1${url}`,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                )
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

module.exports = {
    spotify
};