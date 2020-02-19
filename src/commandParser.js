const commandList = require('./app/common/bot/helpers/global/commandList');
const common = require('./app/common/core');
const roleManager = require('./app/common/roleManager/adapter');

async function verify(message, permissionLevel) {
    return new Promise(async function (resolve, reject) {
        roleManager.verifyPermission(message, message.author.id, permissionLevel)
            .then(result => {
                if (!result.status)
                    (result.reason) ? reject(result.reason) : reject('Operation rejected by permission verification.');
                else
                    resolve(true);
            })
            .catch(e => console.log(e));
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

async function parseCommand(message, command, args = null, mentionedUser = null) {
    console.log(command, args, mentionedUser)
    return new Promise(function (resolve, reject) {
        switch (command) {
            case 'clean': {
                verify(message, commonLevel('clean'))
                    .then(() => resolve(common.bot.cleanChat(message)))
                    .catch(r => reject(r));
                break;
            }
            case '?': { }
            case 'help': {
                verify(message, commonLevel('help'))
                    .then(() => resolve(common.bot.listHelp(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'ping': {
                verify(message, commonLevel('ping'))
                    .then(() => resolve(common.bot.ping(message, common.client)))
                    .catch(r => reject(r));
                break;
            }
            case 'roll': {
                verify(message, commonLevel('roll'))
                    .then(() => resolve(common.roll(message, args)))
                    .catch(r => reject(r));
                break;
            }
            case 'shuffle': {
                verify(message, commonLevel('shuffle'))
                    .then(() => resolve(common.bot.shuffle(message, args[0].split(','))))
                    .catch(r => reject(r));
                break;
            }
            case 'whoami': {
                verify(message, commonLevel('whoami'))
                    .then(() => resolve(common.bot.whoami(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'whoareyou': {
                verify(message, commonLevel('whoareyou'))
                    .then(() => resolve(common.bot.whoareyou(message)))
                    .catch(r => reject(r));
                break;
            }

            // RoleManager

            case 'setmotd': {
                verify(message, roleManagerLevel('setmotd'))
                    .then(() => resolve(common.roleManager.setmotd(message, args)))
                    .catch(r => reject(r));
                break;
            }
            case 'motd': {
                verify(message, roleManagerLevel('motd'))
                    .then(() => resolve(common.roleManager.motd(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'warn': {
                verify(message, roleManagerLevel('warn'))
                    .then(() => resolve(common.roleManager.warnUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'kick': {
                verify(message, roleManagerLevel('kick'))
                    .then(() => resolve(common.roleManager.kickUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'ban': {
                verify(message, roleManagerLevel('ban'))
                    .then(() => resolve(common.roleManager.banUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'unban': { }
            case 'revertban': {
                verify(message, roleManagerLevel('unban'))
                    .then(() => resolve(common.roleManager.unbanUser(message, args[0], args.slice(1).join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'rm-reset': {
                verify(message, roleManagerLevel('rm-reset'))
                    .then(() => resolve(common.roleManager.modUserByString(message, message.guild.members.get((mentionedUser) ? mentionedUser.id : args[0]), 'reset', {})))
                    .catch(r => reject(r));
                break;
            }
            case 'fetchbans': {
                verify(message, roleManagerLevel('fetchbans'))
                    .then(() => resolve(common.roleManager.fetchBans(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'rm-info': {
                verify(message, roleManagerLevel('rm-info'))
                    .then(() => resolve(common.roleManager.userInfo(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'rm-roleinfo': {
                verify(message, roleManagerLevel('rm-roleinfo'))
                    .then(() => resolve(common.roleManager.userRoleInfo(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'warnings': {
                verify(message, roleManagerLevel('warnings'))
                    .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'warnings')))
                    .catch(r => reject(r));
                break;
            }
            case 'kicks': {
                verify(message, roleManagerLevel('kicks'))
                    .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'kicks')))
                    .catch(r => reject(r));
                break;
            }
            case 'bans': {
                verify(message, roleManagerLevel('bans'))
                    .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'bans')))
                    .catch(r => reject(r));
                break;
            }
            case 'unbans': { }
            case 'banreverts': {
                verify(message, roleManagerLevel('banreverts'))
                    .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'banReverts')))
                    .catch(r => reject(r));
            }
            case 'promote': {
                verify(message, roleManagerLevel('promote'))
                    .then(() => resolve(common.roleManager.promoteUser(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'demote': {
                verify(message, roleManagerLevel('demote'))
                    .then(() => resolve(common.roleManager.demoteUser(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'setbotadmin': {
                verify(message, roleManagerLevel('setbotadmin'))
                    .then(() => resolve(common.roleManager.setBotAdmin(message, (mentionedUser) ? mentionedUser.id : args[0])))
                    .catch(r => reject(r));
                break;
            }

            // Minigames
            case 'slots': {}
            case 'blackjack': {
                verify(message, minigameLevel(command, 'gambling'))
                    .then(() => resolve(common.minigames.run(message, 'gambling', command)))
                    .catch(r => reject(r));
                break;
            }

            case 'cast': {
                verify(message, minigameLevel('cast', 'fishing'))
                    .then(() => resolve(common.minigames.run(message, 'fishing', 'cast')))
                    .catch(r => reject(r));
                break;
            }

            case 'stats': {
                verify(message, minigameLevel('stats'))
                    .then(() => resolve(common.minigames.listStats(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'inv': {
                verify(message, minigameLevel('inv'))
                    .then(() => resolve(common.minigames.listInv(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'sell': {
                verify(message, minigameLevel('sell'))
                    .then(() => resolve(common.minigames.sellInv(message)))
                    .catch(r => reject(r));
                break;
            }

            // Music

            case 'play': {
                verify(message, musicLevel('play'))
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(common.music.play(message, null, args.join(' ').slice(1), null));
                        else resolve(common.music.play(message, args[0], null, null));
                    })
                    .catch(r => reject(r));
                break;
            }
            case 'join': {
                verify(message, musicLevel('join'))
                    .then(() => resolve(common.music.join(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'leave': {
                verify(message, musicLevel('leave'))
                    .then(() => resolve(common.music.leave(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'skip': {
                verify(message, musicLevel('skip'))
                    .then(() => resolve(common.music.skip(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'stop': {
                verify(message, musicLevel('stop'))
                    .then(() => resolve(common.music.stop(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'q': { }
            case 'queue': {
                verify(message, musicLevel('queue'))
                    .then(() => resolve(common.music.listQueue(message)))
                    .catch(r => reject(r));
                break;
            }
            case 'rmqueue': { }
            case 'removefromqueue': {
                verify(message, musicLevel('removefromqueue'))
                    .then(() => resolve(common.music.removeFromQueue(message, args[0])))
                    .catch(r => reject(r));
                break;
            }
            case 'songinfo': {
                verify(message, musicLevel('songinfo'))
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(common.music.songInfo(message, null, args.join(' ')));
                        else resolve(common.music.songInfo(message, args[0], null));
                    })
                    .catch(r => reject(r));
                break;
            }
            case 'pl': { }
            case 'playlist': {
                common.music.playlistCommand(message, args)
                    .then(s => resolve(s))
                    .catch(r => reject(r));
                break;
            }

            // Memes

            case 'f': {
                verify(message, memeLevel('f'))
                    .then(() => resolve(common.memes.memeDispatch(message, 'f')))
                    .catch(r => reject(r));
                break;
            }
            case 'fuck': {
                verify(message, memeLevel('fuck'))
                    .then(() => resolve(common.memes.memeDispatch(message, 'fuuu')))
                    .catch(r => reject(r));
                break;
            }
            case 'yey': {
                verify(message, memeLevel('yey'))
                    .then(() => resolve(common.memes.memeDispatch(message, 'yey')))
                    .catch(r => reject(r));
                break;
            }

            case 'penguin': {
                verify(message, memeLevel('penguin'))
                    .then(() => resolve(common.memes.memeDispatch(message, 'penguin')))
                    .catch(r => reject(r));
                break;
            }
            case 'clayhead': {
                verify(message, memeLevel('clayhead'))
                    .then(() => resolve(common.memes.memeDispatch(message, 'clayhead')))
                    .catch(r => reject(r));
                break;
            }

            case 'cr': { }
            case 'crabrave': {
                verify(message, memeLevel('crabrave'))
                    .then(() => resolve(common.music.play(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM', null, null)))
                    .catch(r => reject(r));
                break;
            }

            // Dungeons

            case 'dd_loaditems': {
                verify(message, dungeonLevel('dd_loaditems'))
                    .then(() => resolve(common.dungeons.csvToMap()))
                    .catch(r => reject(r));
                break;
            }
            case 'dd_getitem': {
                verify(message, dungeonLevel('dd_getitem'))
                    .then(() => resolve(common.dungeons.getItem(message, args.join(' '))))
                    .catch(r => reject(r));
                break;
            }
            case 'dd_getshop': {
                verify(message, dungeonLevel('dd_getshop'))
                    .then(() => resolve(common.dungeons.getShop(message, (!isNaN(args[0]) ? args[0] : 10))))
                    .catch(r => reject(r));
            }
            case 'dd_list': {
                verify(message, dungeonLevel('dd_list'))
                    .then(() => resolve(common.dungeons.listItems(message, args.join(' '))))
                    .catch(r => reject(r));
                break;
            }
        }
    });
}

module.exports = async function (message) {
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const mentionedUser = message.mentions.members.first() || null;

    return new Promise(async function (resolve, reject) {
        parseCommand(message, command, args, mentionedUser)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}