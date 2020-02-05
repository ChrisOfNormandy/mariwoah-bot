const Discord = require('discord.js');
const help = require('./help');

module.exports = function(message) {
    let admin = message.member.hasPermission("ADMINISTRATOR");
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

    let embedMsg = new Discord.RichEmbed()
        .setTitle(sect.header)
        .setColor('#224466');
    let msg = '';

    for (s in sect.commands) {
        if (!admin && (sect.commands[s].admin || sect.commands[s].devOnly)) continue;
        if (sect.commands[s].admin) msg += 'Admin only - ';
        msg += `${sect.commands[s].str}\n`
        if (sect.commands[s].alts) {
            msg += '> Alternatives: ';
            for (let i = 0; i < sect.commands[s].alts.length; i++) {
                if (i < sect.commands[s].alts.length - 1)
                    msg += `${sect.commands[s].alts[i]}, `;
                else
                    msg += `${sect.commands[s].alts[i]}`;
            }
            msg += '\n'
        }
        if (sect.commands[s].args) {
            msg += '> Arguments:\n';
            for (let i = 0; i < sect.commands[s].args[0].length; i++) {
                msg += `>   <${sect.commands[s].args[0][i]}> - ${sect.commands[s].args[1][i]}\n`;
            }
        }
        if (sect.commands[s].flags) {
            msg += '> Flags:\n';
            for (let i = 0; i < sect.commands[s].flags[0].length; i++) {
                msg += `>   -${sect.commands[s].flags[0][i]}: ${sect.commands[s].flags[1][i]}\n`;
            }
        }
        embedMsg.addField(s, msg);
        msg = '';
    }
    if (sect.subcommands) {       
        for (s in sect.subcommands) {
            msg += `> ${s}\n`;
        }
        embedMsg.addField('Subcommands', msg);
    }

    embedMsg.setFooter('This message will self destruct in 30 seconds...');

    message.channel.send(embedMsg)
    .then(msg => {
        setTimeout(() => {
            message.delete();
            msg.delete();
        }, 30000);
    })
    .catch(e => {
        console.log(e);
        message.channel.send(`An unexpected error occured trying to list the help. Sorry :(`);
    })
}