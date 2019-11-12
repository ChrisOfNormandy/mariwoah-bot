module.exports = {
    chatBreak:"-------------------------",
    playlistPath:"./main/playlists/",
    statsPath:"./main/stats.json",
    client: null,

    log: async function (string, flag) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let date = new Date();
            let dmy = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            let time =
            `${(date.getHours() < 12)
            ? (date.getHours == 0) ? 12 : date.getHours()
            : date.getHours() - 12
            }:${(date.getMinutes() < 10)
            ? `0${date.getMinutes()}`
            : date.getMinutes()
            }:${(date.getSeconds() < 10)
            ? `0${date.getSeconds()}`
            : date.getSeconds()
            }:${date.getMilliseconds()}`
            let str = `> ${dmy} | ${time} `;

            switch (flag) {
                case 'warn': {
                    str += ':warning: - ';
                    break;
                }
                case 'error': {
                    str += ':rotating_light: - ';
                    break;
                }
                case 'info': {
                    str += ':information_source: - ';
                    break;
                }
                default: {
                    str += '- ';
                    break;
                }
            }
            str += `"${string}"`;
            try {
                _this.client.channels.get("643564636326592523").send(str);
                resolve(true);
            }
            catch (e) {
                console.log(e);
                try {
                    _this.client.users.get("188020615989428224").send(`Could not global log string:\n${str}`);
                }
                catch (err) {
                    console.log(err);
                }
                reject(false);
            }
        });
    }
}