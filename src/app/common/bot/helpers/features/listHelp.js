const chatFormat = require('../global/chatFormat');
const Discord = require('discord.js');
const help = require('../global/commandList');
const db = require('../../../../sql/adapter');

module.exports = function (message, args) {
    return new Promise((resolve, reject) => {
        let str = args.join(' ');

        let reg = str.match(/\d/);
        let pageNumber = reg != null
            ? reg[0] - 1
            : 0;
        let category = str.match(/[a-z]+/g) || ['main'];

        if (pageNumber < 0)
            pageNumber = 0;

        sect = (category[1] && category[0] != 'parameters')
            ? help[category[0]].subcommands[category[1]]
            : help[category[0]];

        if (pageNumber > sect.commands.page.length)
            pageNumber = sect.commands.page.length;



        let embedMsg = new Discord.MessageEmbed()
            .setTitle(sect.header)
            .setColor(chatFormat.colors.information);
        let msg = '';
        let s; // String name for command part from page array.

        if (category[0] == 'parameters') {
            let obj = help[category[0]].type;
            if (category[1]) {
                for (let i in obj[category[1]]) {
                    msg += `**${i}**: ${obj[category[1]][i]}\n`
                }
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
        }
        resolve(embedMsg);
    });
}