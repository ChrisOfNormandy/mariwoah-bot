const chatFormat = require('../global/chatFormat');
const Discord = require('discord.js');
const help = require('../global/commandList');
// const db = require('../../../../sql/adapter');

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
        if (category[0] != 'syntaxes') {
            sect = (category[1])
                ? help[category[0]].subcommands[category[1]]
                : help[category[0]];

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
            for (let i in sect.commands.page[pageNumber]) {
                s = sect.commands.page[pageNumber][i];

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

                embed.addField(s, msg);
                msg = '';
            }

            if (sect.subcommands) {
                for (i in sect.subcommands.page)
                    for (s in sect.subcommands.page[i])
                        msg += `> ${s}\n`;
                embed.addField('Subcommands', msg);
            }

            embed.setFooter(`Page ${pageNumber + 1} of ${sect.commands.page.length}\n\nThis message will self destruct in 30 seconds...`);
        }
        resolve({embed, options: {clear: 30}});
    });
}