const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message, data, list) => {
    let embed = new Discord.MessageEmbed()
        .setColor(chatFormat.colors.information);

    let groups = {};

    if (data.arguments[0] !== undefined) {
        let arg = data.arguments[0];
        if (/[\?]/.test(arg))
            arg = `\\${arg}`;

        embed.setTitle(`Help - ${arg}`);

        let arr_ = list.filter((cmd) => {
            return cmd.regex.command.source.replace(/[\/\(\)]/g, '').split(/[\|]/g).includes(arg);
        });
        
        // Remove duplicates
        let arr = arr_.filter((cmd, index, self) => {
            return self.findIndex(t => t.regex.command.source === cmd.regex.command.source) === index;
        });

        if (arr.length) {
            arr.forEach(cmd => {
                let msg = '';

                if (cmd.regex.arguments !== null)
                    for (let arg in cmd.description.arguments) {
                        let desc = cmd.description.arguments[arg];
                        msg += `${desc.optional ? '_' : ''}${desc._}: ${desc.d}${desc.optional ? '_' : ''}`;
                        if (arg < cmd.description.arguments.length - 1)
                            msg += '\n';
                    }
                else
                    msg = 'No arguments.';

                let syntax = `${data.prefix}${cmd.regex.command.source.replace(/[\/\(\)]/g, '').split(/[\|]/g)[0]}`;
                for (let i in cmd.description.arguments) {
                    if (/\\s\??/.test(cmd.regex.arguments.source))
                        syntax += ' ';
                    syntax += `${cmd.description.arguments[i].optional ? '_' : ''}<${cmd.description.arguments[i]._}>${cmd.description.arguments[i].optional ? '_' : ''}`;
                }

                embed.addField(cmd.description.command, msg);
                embed.addField('Syntax', syntax);

                if (!!cmd.description.flags) {
                    let flags = '';
                    for (let i in cmd.description.flags) {
                        flags += `${cmd.description.flags[i]._} : ${cmd.description.flags[i].d}`;
                        if (i < cmd.description.flags.length)
                            flags += '\n';
                    }
                    embed.addField('Flags', flags);
                }
            });
            embed.setFooter('Arguments in italics are optional.');
        }
        else
            embed.addField('Oops!', `Could not find a command matching "${arg}".`);
    }
    else {
        embed.setTitle('Help - All');

        list.forEach(cmd => {
            if (!!groups[cmd.group])
                groups[cmd.group].push(cmd);
            else
                groups[cmd.group] = [cmd];
        });

        for (let g in groups) {
            let msg = '';

            const arr = groups[g].filter((cmd, index, self) => {
                return self.findIndex(t => t.regex.command.source === cmd.regex.command.source) === index
            });

            const l = arr.length
            for (let i = 0; i < l; i++) {
                msg += arr[i].regex.command.source.replace(/[\/\(\)]/g, '').replace(/[\|]/g, ' | ');
                if (i < groups[g].length - 1)
                    msg += '\n'
            }
            embed.addField(g, msg, true);
        }
    }

    return Promise.resolve(output.valid([list], [embed]));
}