const Discord = require('discord.js');
const help = require('./commandList');
const getPerm = require('../../roleManager/helpers/getUserPermissionLevel');

module.exports = async function(message) {
    getPerm(message, message.author.id)
    .then(perms => {
        const lvl = (message.member.hasPermission("ADMINISTRATOR") || perms.botAdmin)
            ? 4
            : (perms.botMod)
                ? 3
                : (perms.botHelper)
                    ? 2
                    : perms.level;

        let args = message.content.slice(1).trim().split(/ +/g).slice(1);

        let sect;

        let pageNumber = (args.length == 3)
            ? ((args[2] && !isNaN(args[2])) ? args[2] - 1: 0)
            : ((args[1] && !isNaN(args[1])) ? args[1] - 1: 0);
        if (pageNumber < 0)
            pageNumber = 0;
        console.log(args);
    
        if (!args[0] || !help[args[0]])
            sect = help.main;

        console.log(sect);

        sect = (args.length == 3 && help[args[0]].subcommands[args[1]]) 
            ? help[args[0]].subcommands[args[1]]
            : sect;
    
        let embedMsg = new Discord.RichEmbed()
            .setTitle(sect.header)
            .setColor('#224466');
        let msg = '';
        let s;

        if (pageNumber > sect.commands.page.length - 1)
            pageNumber = sect.commands.page.length - 1;

        for (i in sect.commands.page[pageNumber]) {  
            s = sect.commands.page[pageNumber][i];
            console.log(s);

            if (sect.commands[s].permissionLevel && lvl < sect.commands[s].permissionLevel) continue;

            msg += `${sect.commands[s].description}\n`;
    
            if (sect.commands[s].alternatives) {
                msg += '> Alternatives: ';
                for (let i = 0; i < sect.commands[s].alternatives.length; i++) {
                    msg += (i < sect.commands[s].alternatives.length - 1)
                        ? `${sect.commands[s].alternatives[i]}, `
                        : `${sect.commands[s].alternatives[i]}`;
                }
                msg += '\n'
            }
            if (sect.commands[s].arguments) {
                msg += '> Arguments:\n';
                for (let i = 0; i < sect.commands[s].arguments[0].length; i++)
                    msg += `>   <${sect.commands[s].arguments[0][i]}> - ${sect.commands[s].arguments[1][i]}\n`;
            }
            if (sect.commands[s].flags) {
                msg += '> Flags:\n';
                for (let i = 0; i < sect.commands[s].flags[0].length; i++)
                    msg += `>   -${sect.commands[s].flags[0][i]}: ${sect.commands[s].flags[1][i]}\n`;
            }
            embedMsg.addField(s, msg);
            msg = '';
        }

        if (sect.subcommands) {       
            for (i in sect.subcommands.page)
                for (s in sect.subcommands.page[i])
                    msg += `> ${s}\n`;
            embedMsg.addField('Subcommands', msg);
        }
    
        embedMsg.setFooter(`Page ${pageNumber + 1} of ${sect.commands.page.length}\n\nThis message will self destruct in 30 seconds...`);
    
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
        });
    })
    .catch(e => console.log(e));
    
}