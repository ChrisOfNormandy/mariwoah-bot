const adapter = require('./app/adapter');
const commandList = adapter.common.bot.global.commandList;

function verify(message, permissionLevel) {
    return new Promise((resolve, reject) =>  {
        adapter.rolemanagement.verifyPermission(message, message.author.id, permissionLevel)
            .then(r => resolve(r))
            .catch(reason => {
                message.channel.send(reason);
                reject(reason);
            });
    });
}

function commonLevel(commandName) {
    return commandList.common.commands[commandName].permissionLevel || 10;
}
function roleManagerLevel(commandName) {
    return commandList.rolemanager.commands[commandName].permissionLevel || 10;
}
function musicLevel(commandName) {
    return commandList.music.commands[commandName].permissionLevel || 10;
}
function minigameLevel(commandName, section = null) {
    return (section == null)
        ? commandList.minigames.commands[commandName].permissionLevel || 10
        : commandList.minigames.subcommands[section].commands || 10;
}
function memeLevel(commandName) {
    return commandList.memes.commands[commandName].permissionLevel || 10;
}
function dungeonLevel(commandName) {
    return commandList.dungeons.commands[commandName].permissionLevel || 10;
}

function parseCommand(client, message, command, args = null, mentionedUser = null) {
    return new Promise((resolve, reject) =>  {
        switch (command) {
            case 'clean': {
                verify(message, commonLevel('clean'))
                    .then(() => resolve(adapter.common.bot.features.cleanChat(message)))
                    .catch(r => reject(r));
                break;
            }
            case '?': { }
            case 'help': {
                verify(message, commonLevel('help'))
                    .then(() => resolve(adapter.common.bot.features.listHelp(message, args)))
                    .catch(r => reject(r));
                break;
            }
            case 'ping': {
                verify(message, commonLevel('ping'))
                    .then(() => resolve(adapter.common.bot.features.ping(message, client)))
                    .catch(r => reject(r));
                break;
            }
            case 'roll': {
                verify(message, commonLevel('roll'))
                    .then(() => resolve(adapter.common.bot.features.roll(message, args)))
                    .catch(r => reject(r));
                break;
            }
            case 'shuffle': {
                verify(message, commonLevel('shuffle'))
                    .then(() => {
                        adapter.common.bot.global.shuffle(args[0].split(','))
                            .then(array => resolve(message.channel.send(array.join(', '))))
                            .catch(r => reject(r));
                    })
                    .catch(r => reject(r));
                break;
            }
            case 'whoami': {
                verify(message, commonLevel('whoami'))
                    .then(() => resolve(adapter.common.bot.features.whoAre.self(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'whoareyou': {
                verify(message, commonLevel('whoareyou'))
                    .then(() => resolve(adapter.common.bot.features.whoAre.member(message)))
                    .catch(r => reject(r));
                break;
            }

            case 'setmotd': {
                verify(message, commonLevel('setmotd'))
                    .then(() => {
                        if (args[0] == '-r')
                            resolve(adapter.common.bot.features.motd.set(message, "First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://google.com/"))
                        else
                            resolve(adapter.common.bot.features.motd.set(message, args.join(' ')))
                    })
                    .catch(r => reject(r));
                break;
            }
            case 'motd': {
                verify(message, commonLevel('motd'))
                .then(() => {
                    if (args[0] == 'raw')
                        adapter.sql.server.getMotd(message.guild.id)
                            .then(raw => resolve(message.channel.send(`> ${raw.replace('\n', '\\n')}`)))
                            .catch(e => reject(e));
                    else
                        resolve(adapter.common.bot.features.motd.get(message))
                })
                .catch(r => reject(r));
                break;
            }

            case 'setprefix': {
                verify(message, commonLevel('setprefix'))
                    .then(() => adapter.common.bot.features.prefix.set(message, args[0]))
                    .catch(r => reject(r));
                break;
            }
            case 'prefix': {
                verify(message, commonLevel('prefix'))
                    .then(() => adapter.common.bot.features.prefix.get(message))
                    .catch(r => reject(r));
                break;
            }

            // RoleManager

            case 'warn': {
                verify(message, roleManagerLevel('warn'))
                    .then(() => resolve(adapter.punishments.warn.set(message, (mentionedUser !== null) ? mentionedUser.id : args[0], args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'warnings': {
                verify(message, roleManagerLevel('warnings'))
                    .then(() => resolve(adapter.punishments.warn.printAll(message, mentionedUser.id)))
                    .catch(r => reject(r));
                break;
            }
            case 'kick': {
                verify(message, roleManagerLevel('kick'))
                    .then(() => resolve(adapter.punishments.kick.set(message, (mentionedUser !== null) ? mentionedUser.id : args[0], args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'kicks': {
                verify(message, roleManagerLevel('kicks'))
                    .then(() => resolve(adapter.punishments.kick.printAll(message, mentionedUser.id)))
                    .catch(r => reject(r));
                break;
            }
            case 'ban': {
                verify(message, roleManagerLevel('ban'))
                    .then(() => resolve(adapter.punishments.ban.set(message, (mentionedUser !== null) ? mentionedUser.id : args[0], args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'bans': {
                verify(message, roleManagerLevel('bans'))
                    .then(() => resolve(adapter.punishments.ban.printAll(message, mentionedUser.id)))
                    .catch(r => reject(r));
                break;
            }
            case 'unban': {
                verify(message, roleManagerLevel('unban'))
                    .then(() => resolve(message.guild.members.unban(args[0])
                        .then(user => {
                            message.channel.send(`Unbanned ${user.username}.`);

                            // message.channel.inviteCreate({
                            //     maxUses: 1,
                            //     unique: true,
                            //     maxAge: 86400
                            // })
                            // .then(invite => {
                                user.send(`You have been unbanned from ${message.guild.name}.`);
                                // user.send(invite);
                            // })
                            // .catch(e => console.log(e));
                        })
                        .catch(e => message.channel.send(`Cannot unban user.\n${e.message}`))
                    ))
                    .catch(r => reject(r));
                break;
            }

            // case 'pardon': {
            //     verify(message, roleManagerLevel('pardon'))
            //         .then(() => resolve(common.roleManager.pardonUser(message, (mentionedUser !== null) ? mentionedUser.id : args[0], args.slice(3).join(' '), args[1], args[2])))
            //         .catch(r => reject(r));
            //     break;
            // }

            case 'promote': {
                verify(message, roleManagerLevel('promote'))
                    .then(() => resolve(adapter.rolemanagement.setPermission.promote(message, (mentionedUser) ? mentionedUser.id : args[0], args[1])))
                    .catch(r => reject(r));
                break;
            }
            case 'demote': {
                verify(message, roleManagerLevel('demote'))
                    .then(() => resolve(adapter.rolemanagement.setPermission.demote(message, (mentionedUser) ? mentionedUser.id : args[0], args[1])))
                    .catch(r => reject(r));
                break;
            }

            case 'setbotadmin': {
                verify(message, roleManagerLevel('setbotadmin'))
                    .then(() => resolve(adapter.rolemanagement.setRank.admin(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'setbotmod': {
                verify(message, roleManagerLevel('setbotmod'))
                    .then(() => resolve(adapter.rolemanagement.setRank.moderator(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'setbothelper': {
                verify(message, roleManagerLevel('setbothelper'))
                    .then(() => resolve(adapter.rolemanagement.setRank.helper(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'refreshrole': {
                verify(message, roleManagerLevel('refreshrole'))
                    .then(() => resolve(adapter.rolemanagement.setRoles.refresh_user(message, message.mentions.members.first() || message.member)))
                    .catch(r => reject(r));
                break;
            }
            case 'refreshroles': {
                verify(message, roleManagerLevel('refreshroles'))
                    .then(() => resolve(adapter.rolemanagement.setRoles.refresh_guild(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'resetroles': {
                verify(message, roleManagerLevel('resetroles'))
                    .then(() => resolve(adapter.rolemanagement.setRoles.reset_guild(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'purgeroles': {
                verify(message, roleManagerLevel('purgeroles'))
                    .then(() => resolve(adapter.rolemanagement.setRoles.purge(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'setrole': {
                verify(message, roleManagerLevel('setrole'))
                    .then(() => resolve(adapter.rolemanagement.setRoles.setRole(message, args[0], message.mentions.roles.first())))
                    .catch(r => reject(r));
                break;
            }

            // Minigames
            case 'stats': {
                verify(message, minigameLevel('stats'))
                    .then(() => {
                        switch(args[0]) {
                            case 'fishing': {
                                resolve(adapter.minigames.fishing.print(message))
                                break;
                            }
                            default: {
                                resolve(adapter.minigames.printStats(message))
                                break;
                            }
                        }
                    })
            }
            case 'cast': {
                verify(message, minigameLevel('cast', 'fishing'))
                    .then(() => resolve(adapter.minigames.fishing.cast(message)))
                    .catch(r => reject(r));
                break;
            }

            // case 'slots': { }
            // case 'blackjack': {
            //     verify(message, minigameLevel(command, 'gambling'))
            //         .then(() => resolve(common.minigames.run(message, 'gambling', command)))
            //         .catch(r => reject(r));
            //     break;
            // }

            // case 'cast': {
            //     verify(message, minigameLevel('cast', 'fishing'))
            //         .then(() => resolve(common.minigames.run(message, 'fishing', 'cast')))
            //         .catch(r => reject(r));
            //     break;
            // }

            
            // case 'inv': {
            //     verify(message, minigameLevel('inv'))
            //         .then(() => resolve(common.minigames.listInv(message)))
            //         .catch(r => reject(r));
            //     break;
            // }
            // case 'sell': {
            //     verify(message, minigameLevel('sell'))
            //         .then(() => resolve(common.minigames.sellInv(message)))
            //         .catch(r => reject(r));
            //     break;
            // }

            // Music

            case 'p': {}
            case 'play': {
                verify(message, musicLevel('play'))
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(adapter.music.append.byName(message, args.join(' ')));
                        else resolve(adapter.music.append.byURL(message, args[0]));
                    })
                    .catch(r => reject(r));
                break;
            }
            case 'join': {
                verify(message, musicLevel('join'))
                    .then(() => resolve(adapter.music.join(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'leave': {
                verify(message, musicLevel('leave'))
                    .then(() => resolve(adapter.music.leave(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'skip': {
                verify(message, musicLevel('skip'))
                    .then(() => resolve(adapter.music.skip(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'stop': {
                verify(message, musicLevel('stop'))
                    .then(() => resolve(adapter.music.stop(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'q': { }
            case 'queue': {
                verify(message, musicLevel('queue'))
                    .then(() => resolve(adapter.music.list(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'pause': {
                verify(message, musicLevel('pause'))
                    .then(() => resolve(adapter.music.pause(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'resume': {
                verify(message, musicLevel('resume'))
                    .then(() => resolve(adapter.music.resume(message)))
                    .catch(r => reject(r));
                break;
            }
            // case 'rmqueue': { }
            // case 'removefromqueue': {
            //     verify(message, musicLevel('removefromqueue'))
            //         .then(() => resolve(adapter.music.removeFromQueue(message, args[0])))
            //         .catch(r => reject(r));
            //     break;
            // }
            // case 'songinfo': {
            //     verify(message, musicLevel('songinfo'))
            //         .then(() => {
            //             if (!args.join(' ').includes('youtube.com/watch?'))
            //                 resolve(adapter.music.songInfo(message, null, args.join(' ')));
            //             else resolve(adapter.music.songInfo(message, args[0], null));
            //         })
            //         .catch(r => reject(r));
            //     break;
            // }
            case 'pl': { }
            case 'playlist': {
                adapter.music.playlistCommand(message, args)
                    .then(s => resolve(s))
                    .catch(r => reject(r));
                break;
            }

            // Memes

            case 'f': {
                verify(message, memeLevel('f'))
                    .then(() => resolve(adapter.memes.memeDispatch(message, 'f')))
                    .catch(r => reject(r));
                break;
            }
            case 'fuck': {
                verify(message, memeLevel('fuck'))
                    .then(() => resolve(adapter.memes.memeDispatch(message, 'fuuu')))
                    .catch(r => reject(r));
                break;
            }
            case 'yey': {
                verify(message, memeLevel('yey'))
                    .then(() => resolve(adapter.memes.memeDispatch(message, 'yey')))
                    .catch(r => reject(r));
                break;
            }

            case 'penguin': {
                verify(message, memeLevel('penguin'))
                    .then(() => resolve(adapter.memes.memeDispatch(message, 'penguin')))
                    .catch(r => reject(r));
                break;
            }
            case 'clayhead': {
                verify(message, memeLevel('clayhead'))
                    .then(() => resolve(adapter.memes.memeDispatch(message, 'clayhead')))
                    .catch(r => reject(r));
                break;
            }

            case 'cr': { }
            case 'crabrave': {
                verify(message, memeLevel('crabrave'))
                    .then(() => resolve(adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM')))
                    .catch(r => reject(r));
                break;
            }
            case 'theriddle': {
                verify(message, memeLevel('theriddle'))
                    .then(() => resolve(adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI')))
                    .catch(r => reject(r));
            }

            // Dungeons

            // case 'dd_loaditems': {
            //     verify(message, dungeonLevel('dd_loaditems'))
            //         .then(() => resolve(adapter.dungeons.csvToMap()))
            //         .catch(r => reject(r));
            //     break;
            // }
            // case 'dd_getitem': {
            //     verify(message, dungeonLevel('dd_getitem'))
            //         .then(() => resolve(adapter.dungeons.getItem(message, args.join(' '))))
            //         .catch(r => reject(r));
            //     break;
            // }
            // case 'dd_getshop': {
            //     verify(message, dungeonLevel('dd_getshop'))
            //         .then(() => resolve(adapter.dungeons.getShop(message, (!isNaN(args[0]) ? args[0] : 10))))
            //         .catch(r => reject(r));
            // }
            // case 'dd_list': {
            //     verify(message, dungeonLevel('dd_list'))
            //         .then(() => resolve(adapter.dungeons.listItems(message, args.join(' '))))
            //         .catch(r => reject(r));
            //     break;
            // }

            // case 'isadmin': {
            //     adapter.rolemanagement.getRoles.admin(message, message.member);
            //     break;
            // }
            
            default: {
                reject(null);
            }
        }
    });
}

module.exports = function (client, message) {
    return new Promise((resolve, reject) =>  {
        adapter.sql.server.getPrefix(message.guild.id)
            .then(prefix => {
                if (message.content[0] != prefix)
                    reject(null);
                else {
                    let msgArray = message.content.split(' ');
                    let command = msgArray[0].slice(1);
                    let args = msgArray.slice(1);
                    let mentionedUser = message.mentions.members.first() || null;

                    parseCommand(client, message, command, args, mentionedUser)
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}