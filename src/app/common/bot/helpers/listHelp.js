const Discord = require('discord.js');
const help = require('./commandList');
const getPerm = require('../../roleManager/helpers/getUserPermissionLevel');

module.exports = async function(message) {
    let admin = message.member.hasPermission("ADMINISTRATOR");
    getPerm(message, message.author.id)
    .then(perms => {
        let arr = message.content.split(' ');
        let sect;
    
        if (!help[arr[1]])
            sect = help.main;
        else {
            if (arr.length == 3) {
                if (!help[arr[1]].subcommands[arr[2]]) sect = help[arr[1]];
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
    
            msg += `${sect.commands[s].str}\n`;
    
            if (sect.commands[s].alternatives) {
                msg += '> Alternatives: ';
                for (let i = 0; i < sect.commands[s].alternatives.length; i++) {
                    if (i < sect.commands[s].alternatives.length - 1)
                        msg += `${sect.commands[s].alternatives[i]}, `;
                    else
                        msg += `${sect.commands[s].alternatives[i]}`;
                }
                msg += '\n'
            }
            if (sect.commands[s].arguments) {
                msg += '> Arguments:\n';
                for (let i = 0; i < sect.commands[s].arguments[0].length; i++) {
                    msg += `>   <${sect.commands[s].arguments[0][i]}> - ${sect.commands[s].arguments[1][i]}\n`;
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
    })
    .catch(e => console.log(e));
    
}