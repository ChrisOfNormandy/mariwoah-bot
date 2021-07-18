const axios = require('axios').default;

// const url_raw = `https://production.api.coindesk.com/v2/price/values/DOGE?start_date=2021-05-05T03:00&end_date=2021-05-05T03:45&ohlc=false`;

module.exports = (coin) => {
    const current = new Date();
    const minus1h = new Date(new Date().setMinutes(current.getMinutes() - 15));

    const startTime = new Date(minus1h.toUTCString()).toJSON().replace(/:\d{2}\.[\dA-Z]*/, '');
    const endTime = new Date(current.toUTCString()).toJSON().replace(/:\d{2}\.[\dA-Z]*/, '');

    const url = `https://production.api.coindesk.com/v2/price/values/${coin}?start_date=${startTime}&end_date=${endTime}&ohlc=false`;

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => resolve({ data: response.data.data, startTime, endTime } || null))
            .catch(err => reject(err));
    });
};