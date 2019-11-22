const help = require('./help');

module.exports = function(message) {
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
    if (sect.subcommands) {
        message.channel.send(msg);
        
        msg = '__**### Subcommands ###**__\n';
        for (s in sect.subcommands) {
            msg += `> ${s}\n`;
        }
    }

    message.channel.send(msg);
}