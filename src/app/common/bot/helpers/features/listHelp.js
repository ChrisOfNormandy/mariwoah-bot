const Discord = require('discord.js');

const chatFormat = require('../global/chatFormat');
const commandFormat = require('../global/commandFormat');
const help = require('../../../../../commandList');

module.exports = function (message, args) {
    return new Promise((resolve, reject) => {
        // Convert the args to a single string for easier regex checking.
        let str = args.join(' ');

        // Search the string for the first integer and set as page number.
        let reg = str.match(/\d/);
        let pageNumber = reg != null
            ? reg[0] - 1
            : 0;

        // Search the string for all words. 0 = command category, 1 = subcommand
        let category = str.match(/[a-z]+/g) || ['main'];

        if (pageNumber < 0)
            pageNumber = 0;

        let sect;
        let command_only = false;
        let subcommand = false;

        if (category[0] != 'syntaxes') {
            command_only = !!help[category[0]].commands[category[1]] || (!!help[category[0]].subcommands && category[1]) ? !!help[category[0]].subcommands[category[1]] : false;
            subcommand = (!!help[category[0]].subcommands && category[1]) ? !!help[category[0]].subcommands[category[1]] : false;

            sect = help[category[0]];

            if (pageNumber > sect.commands.page.length)
                pageNumber = sect.commands.page.length;
        }
        else {
            sect = help.syntaxes;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(sect.header)
            .setColor(chatFormat.colors.information);
        let msg = '';
        let s; // String name for command part from page array.

        if (category[0] == 'syntaxes') {
            let obj = help.syntaxes;
            if (category[1]) {
                for (let i in obj[category[1]]) {
                    msg += `**${i}**:\n`
                    for (let x in obj[category[1]][i]) {
                        msg += `*${x}* -- ${obj[category[1]][i][x]}\n`
                    }
                }
                embed.addField(category[1], msg)
            }
            else {
                for (let i in obj) {
                    if (i != 'header')
                        msg += `${i}\n`
                }
                embed.addField('Subcommands', msg)
            }
        }
        else {
            if (!command_only) {
                for (let i in sect.commands.page[pageNumber]) {
                    s = sect.commands.page[pageNumber][i];

                    msg += `${sect.commands[s].description}\n`;

                    if (sect.commands[s].alternatives) {
                        msg += '> _**Alternatives**_: ';
                        for (let i in sect.commands[s].alternatives) {
                            msg += (i < sect.commands[s].alternatives.length - 1)
                                ? `${sect.commands[s].alternatives[i]}, `
                                : `${sect.commands[s].alternatives[i]}`;
                        }
                        msg += '\n'
                    }
                    
                    msg += '\n';

                    if (sect.commands[s].arguments) {
                        msg += '> _**Arguments**_:\n';
                        for (let i in sect.commands[s].arguments[0])
                            msg += `>   <${sect.commands[s].arguments[0][i]}> - ${sect.commands[s].arguments[1][i]}\n`;
                    }
                    if (sect.commands[s].parameters) {
                        if (sect.commands[s].arguments)
                            msg += '\n';

                        msg += '> _**Parameters**_:\n';
                        for (let p in sect.commands[s].parameters) {
                            msg += `> - _**${p}**_:\n`
                                for (let i in sect.commands[s].parameters[p])
                                    msg += `> --- ${i}: ${sect.commands[s].parameters[p][i]}\n`;
                        }
                    }
                    if (sect.commands[s].flags) {
                        if (sect.commands[s].arguments || sect.commands[s].parameters)
                            msg += '\n';

                        msg += '> _**Flags**_:\n';
                        for (let i in sect.commands[s].flags)
                            msg += `>   -${i}: ${sect.commands[s].flags[i]}\n`;
                    }

                    embed.addField(s, msg);
                    msg = '';
                }

                if (sect.subcommands) {
                    for (i in sect.subcommands.page)
                        for (s in sect.subcommands.page[i])
                            msg += `> ${sect.subcommands.page[i][s]}\n`;
                    embed.addField('Subcommands', msg);
                }
            }
            else {
                s = (subcommand) ? help[category[0]].subcommands[category[1]] : sect[category[0]].commands[category[1]];

                msg += `${s.description}\n`;

                if (s.alternatives) {
                    msg += '> _**Alternatives**_: ';
                    for (let i in s.alternatives) {
                        msg += (i < s.alternatives.length - 1)
                            ? `${s.alternatives[i]}, `
                            : `${s.alternatives[i]}`;
                    }
                    msg += '\n'
                }

                msg += '\n';

                if (s.arguments) {
                    msg += '> _**Arguments**_:\n';
                    for (let i in s.arguments[0])
                        msg += `>   <${s.arguments[0][i]}> - ${s.arguments[1][i]}\n`;
                }
                if (s.parameters) {
                    if (s.arguments)
                        msg += '\n';

                    msg += '> _**Parameters**_:\n';
                    for (let p in s.parameters) {
                        msg += `> - _**${p}**_:\n`
                            for (let i in s.parameters[p])
                                msg += `> --- ${i}: ${s.parameters[p][i]}\n`;
                    }
                }
                if (s.flags) {
                    if (s.arguments || s.parameters)
                        msg += '\n';

                    msg += '> _**Flags**_:\n';
                    for (let i in s.flags)
                        msg += `>   -${i}: ${s.flags[i]}\n`;
                }

                embed.addField(`${category[0]} ${category[1]}`, msg);
                msg = '';
            }
            embed.setFooter(`Page 1 of 1\n\nThis message will self destruct in 30 seconds...`);
        }
            
        resolve(commandFormat.valid([pageNumber], [embed], {clear: 30}));
    });
}