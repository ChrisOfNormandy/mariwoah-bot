const https = require('https');

module.exports = function (message) {
    var https = require('https');

    var options = {
        host: 'worldometers.info',
        port: 443,
        path: '/coronavirus',
        method: 'GET',
        followAllRedirects: true
    };

    var req = https.request(options, function (res) {

        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function (d) {
            console.log(d.toString())
        });
    });
    req.end();

    req.on('error', function (e) {
        console.error(e);
    });
}