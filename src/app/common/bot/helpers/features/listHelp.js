const chatFormat = require('../global/chatFormat');
const Discord = require('discord.js');
const help = require('../global/commandList');
const db = require('../../../../sql/adapter');

module.exports = async function (message, args) {
    db.user.getBotRole(message.guild.id, message.author.id)
        .then(role => {
            db.user.getPermissionLevel(message.guild.id, message.author.id)
                .then(level => {
                    let userLevel = (role == 'admin' || message.member.hasPermission("ADMINISTRATOR"))
                        ? 4
                        : (role == 'mod')
                            ? 3
                            : (role == 'helper')
                                ? 2
                                : level;

                    let sect;

                    // Get page number to show. If argument not present, sets to 1 (index 0)
                    let pageNumber = (args.length == 3)
                        ? ((args[2] && !isNaN(args[2])) ? args[2] - 1 : 0)
                        : ((args[1] && !isNaN(args[1])) ? args[1] - 1 : 0);
                    if (pageNumber < 0)
                        pageNumber = 0;

                    // If invalid help section or no section provided, set to main help page.
                    if (!args.length || !args[0] || !help[args[0]]) {
                        sect = help.main;
                        pageNumber = 0;
                    }
                    else {
                        // Check for subcommand (0 = category, 1 = subcommand, 2 = page number)
                        sect = (args.length == 3 && help[args[0]].subcommands[args[1]])
                            ? help[args[0]].subcommands[args[1]]
                            : help[args[0]];
                    }

                    let embedMsg = new Discord.MessageEmbed()
                        .setTitle(sect.header)
                        .setColor(chatFormat.colors.information);
                    let msg = '';
                    let s; // String name for command part from page array.

                    if (pageNumber > sect.commands.page.length - 1)
                        pageNumber = sect.commands.page.length - 1;

                    for (i in sect.commands.page[pageNumber]) {
                        s = sect.commands.page[pageNumber][i];

                        if (sect.commands[s].permissionLevel && userLevel < sect.commands[s].permissionLevel)
                            continue;

                        msg += `${sect.commands[s].description}\n`;

                        if (sect.commands[s].alternatives) {
                            msg += '> Alternatives: ';
                            for (let i in sect.commands[s].alternatives) {
                                msg += (i < sect.commands[s].alternatives.length - 1)
                                    ? `${sect.commands[s].alternatives[i]}, `
                                    : `${sect.commands[s].alternatives[i]}`;
                            }
                            msg += '\n'
                        }
                        if (sect.commands[s].arguments) {
                            msg += '> Arguments:\n';
                            for (let i in sect.commands[s].arguments[0])
                                msg += `>   <${sect.commands[s].arguments[0][i]}> - ${sect.commands[s].arguments[1][i]}\n`;
                        }
                        if (sect.commands[s].flags) {
                            msg += '> Flags:\n';
                            for (let i in sect.commands[s].flags[0])
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
                            message.delete();
                            msg.delete({timeout: 30000});
                        })
                        .catch(e => {
                            console.log(e);
                            message.channel.send(`An unexpected error occured trying to list the help. Sorry :(`);
                        });
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
}