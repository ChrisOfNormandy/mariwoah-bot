const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message, data, list) => {
    const embed = new Discord.MessageEmbed()
        .setColor(chatFormat.colors.information);

    if (!!data.arguments[0]) {
        let command = data.arguments[0];

        if (/\?/.test(command))
            command = `\\${command}`;

        embed.setTitle(`Help - ${command}`);

        const cmdSource = list.filter((cmd) => {
            return cmd.regex.command.source.replace(/[\/\(\)]/g, '').split(/[\|]/g).includes(command);
        });

        if (cmdSource.length) {
            cmdSource.forEach(cmd => {
                if (!cmd.enabled)
                    return;

                // Command description.
                if (!!cmd.subcommands) {
                    cmd.subcommands.forEach((sc, i) => {
                        let field = '';

                        field += `${sc.description.command}\n`;

                        // Command syntax.
                        field += `**Syntax**\n ${data.prefix}${cmd.regex.command.source.replace(/[\/\(\)]/g, '').split(/[\|]/g)[0]} ${sc.name}\n`;

                        // Command argument list.
                        if (!!sc.description.arguments) {
                            let msg = '';

                            sc.description.arguments.forEach((arg, i) => {
                                msg += `${arg.optional ? '_' : ''}${arg._}: ${arg.d}${arg.optional ? '_' : ''}`;

                                if (i < sc.description.arguments.length - 1)
                                    msg += '\n';
                            });

                            field += `**Arguments**\n ${msg}`;
                            embed.setFooter('Arguments in italics are optional.');
                        }

                        // Command flag list.
                        if (!!sc.description.flags) {
                            let msg = '';

                            sc.description.flags.forEach((flag, i) => {
                                msg += `${flag._} : ${flag.d}`;

                                if (i < sc.description.flags.length)
                                    msg += '\n';
                            });

                            field += `**Flags**\n ${msg}`;
                        }

                        embed.addField(`__${sc.name}__`, field, true);
                    });
                }
                else {
                    embed.addField('Description', cmd.description.command);

                    // Command syntax.
                    embed.addField('Syntax', `${data.prefix}${cmd.regex.command.source.replace(/[\/\(\)]/g, '').split(/[\|]/g)[0]}`);

                    // Command argument list.
                    if (!!cmd.description.arguments) {
                        let msg = '';

                        cmd.description.arguments.forEach((arg, i) => {
                            msg += `${arg.optional ? '_' : ''}${arg._}: ${arg.d}${arg.optional ? '_' : ''}`;

                            if (i < cmd.description.arguments.length - 1)
                                msg += '\n';
                        });

                        embed.addField('Arguments', msg);
                        embed.setFooter('Arguments in italics are optional.');
                    }

                    // Command flag list.
                    if (!!cmd.description.flags) {
                        let msg = '';

                        cmd.description.flags.forEach((flag, i) => {
                            msg += `${flag._} : ${flag.d}`;

                            if (i < cmd.description.flags.length)
                                msg += '\n';
                        });

                        embed.addField('Flags', msg);
                    }
                }
            });
        }
        else
            embed.addField('Oops!', `Could not find a command matching "${arg}".`);
    }
    else {
        embed.setTitle('Help - All');
        let groups = {};

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
                if (arr[i].enabled) {
                    msg += arr[i].regex.command.source.replace(/[\/\(\)]/g, '').replace(/[\|]/g, ' | ');

                    if (!!arr[i].subcommands) {
                        msg += '\n';

                        arr[i].subcommands.forEach((v, d) => {
                            if (v.enabled) {
                                msg += `-- ${v.name}`;
                                if (d < arr[i].subcommands.length - 1)
                                    msg += '\n';
                            }
                        });
                    }

                    if (i < groups[g].length - 1)
                        msg += '\n'
                }
            }

            embed.addField(g, msg, true);
        }
    }

    return Promise.resolve(output.valid([list], [embed]));
}