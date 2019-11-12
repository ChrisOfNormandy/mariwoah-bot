let help = require('../help');

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
    },
    
    listHelp: function (message) {

        let arr = message.content.split(' ');
        let sect;
        if (!help[arr[1]]) {
            sect = help.main
        }
        else {
            if (arr.length == 3) {
                if (!help[arr[1]].subcommands[arr[2]]) {
                    sect = help[arr[1]];
                }
                else sect = help[arr[1]].subcommands[arr[2]];
            }
            else sect = help[arr[1]];
        }

        let msg = `__**${sect.header}**__\n`;

        for (s in sect.commands) {
            msg += `__***${s}***__ - ${sect.commands[s].str}\n`
            if (sect.commands[s].alts) {
                msg += '> --- alternates: ';
                for (let i = 0; i < sect.commands[s].alts.length; i++) {
                    if (i == 0) msg += '> '
                    if (i < sect.commands[s].alts.length - 1)
                        msg += `${sect.commands[s].alts[i]}, `;
                    else
                        msg += `${sect.commands[s].alts[i]}`;
                }
            }
            if (sect.commands[s].args) {
                msg += '> --- arguments:\n';
                for (let i = 0; i < sect.commands[s].args[0].length; i++) {
                    msg += `>   <${sect.commands[s].args[0][i]}> - ${sect.commands[s].args[1][i]}\n`;
                }
            }
            if (sect.commands[s].flags) {
                msg += '> --- flags:\n';
                for (let i = 0; i < sect.commands[s].flags[0].length; i++) {
                    msg += `>   -${sect.commands[s].flags[0][i]}: ${sect.commands[s].flags[1][i]}\n`;
                }
            }
        }

        message.channel.send(msg);
    }
}