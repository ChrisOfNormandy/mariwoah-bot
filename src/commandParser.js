const common = require('./app/common/core');
const roleManager = require('./app/common/roleManager/adapter');
const commandList = require('./app/common/bot/helpers/commandList');

async function verify(message, permissionLevel) {
    return new Promise(async function(resolve, reject) {
        roleManager.verifyPermission(message, message.author.id, permissionLevel)
        .then(result => {
            if (!result.status)
                (result.reason) ? reject(result.reason) : reject('Operation rejected by permission verification.');
            else resolve(true);
        })
        .catch(e => console.log(e));
    });
}

const c = commandList.common.commands;
const rM = commandList.rolemanager.commands;
const m = commandList.music.commands;
const mg = commandList.minigames.commands;
const ms = commandList.memes.commands;

function commonLevel(commandName) {
    return c[commandName].permissionLevel || 10;
}
function roleManagerLevel(commandName) {
    return rM[commandName].permissionLevel || 10;
}
function musicLevel(commandName) {
    return m[commandName].permissionLevel || 10;
}
function minigameLevel(commandName, section = null) {
    return (section == null) 
    ? mg[commandName].permissionLevel || 10
    : commandList.minigames.subcommands[section].commands || 10;
}
function memeLevel(commandName) {
    return ms[commandName].permissionLevel || 10;
}

module.exports = async function(message) {
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const mentionedUser = message.mentions.members.first();

    return new Promise(async function(resolve, reject) {
        if (command == 'clean')
            verify(message, commonLevel('clean'))
                .then(() => resolve(common.bot.cleanChat(message)))
                .catch(r => reject(r));
        else if (command == '?' || command == 'help')
            verify(message, commonLevel('help'))
                .then(() => resolve(common.bot.listHelp(message)))
                .catch(r => reject(r));
        else if (command == 'ping')
            verify(message, commonLevel('ping'))
                .then(() => resolve(common.bot.ping(message, common.client)))
                .catch(r => reject(r));
        else if (command == 'roll')
            verify(message, commonLevel('roll'))
                .then(() => resolve(common.roll(message, args)))
                .catch(r => reject(r));
        else if (command == 'shuffle')
            verify(message, commonLevel('shuffle'))
                .then(() => resolve(common.bot.shuffle(message, args[0].split(','))))
                .catch(r => reject(r));
        else if (command == 'whoami')
            verify(message, commonLevel('whoami'))
                .then(() => resolve(common.bot.whoami(message)))
                .catch(r => reject(r));
        else if (command == 'whoareyou')
            verify(message, commonLevel('whoareyou'))
                .then(() => resolve(common.bot.whoareyou(message)))
                .catch(r => reject(r));

        else if (command == 'setmotd')
            verify(message, roleManagerLevel('setmotd'))
                .then(() => resolve(common.roleManager.setmotd(message, args)))
                .catch(r => reject(r));
        else if (command == 'motd')
            verify(message, roleManagerLevel('motd'))
                .then(() => resolve(common.roleManager.motd(message)))
                .catch(r => reject(r));
        else if (command == 'warn')
            verify(message, roleManagerLevel('warn'))
                .then(() => resolve(common.roleManager.warnUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' '))))
                .catch(r => reject(r));
        else if (command == 'kick')
            verify(message, roleManagerLevel('kick'))
                .then(() => resolve(common.roleManager.kickUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' '))))
                .catch(r => reject(r));
        else if (command == 'ban')
            verify(message, roleManagerLevel('ban'))
                .then(() => resolve(common.roleManager.banUser(message, (mentionedUser) ? mentionedUser.id : args.slice(1).join(' ')))) 
                .catch(r => reject(r));
        else if (command == 'unban' || command == 'revertban')
            verify(message, roleManagerLevel('unban'))
                .then(() => resolve(common.roleManager.unbanUser(message, args[0], args.slice(1).join(' '))))
                .catch(r => reject(r));
        else if (command == 'rm-reset')
            verify(message, roleManagerLevel('rm-reset'))
                .then(() => resolve(common.roleManager.modUserByString(message, message.guild.members.get((mentionedUser) ? mentionedUser.id : args[0]), 'reset', {})))
                .catch(r => reject(r));
        else if (command == 'fetchbans')
            verify(message, roleManagerLevel('fetchbans'))
                .then(() => resolve(common.roleManager.fetchBans(message)))
                .catch(r => reject(r));
        else if (command == 'rm-info')
            verify(message, roleManagerLevel('rm-info'))
                .then(() => resolve(common.roleManager.userInfo(message, (mentionedUser) ? mentionedUser.id : args[0])))
                .catch(r => reject(r));
        else if (command == 'rm-roleinfo')
            verify(message, roleManagerLevel('rm-roleinfo'))
                .then(() => resolve(common.roleManager.userRoleInfo(message, (mentionedUser) ? mentionedUser.id : args[0])))
                .catch(r => reject(r));
        else if (command == 'warnings')
            verify(message, roleManagerLevel('warnings'))
                .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'warnings')))
                .catch(r => reject(r));
        else if (command == 'kicks')
            verify(message, roleManagerLevel('kicks'))
                .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'kicks')))
                .catch(r => reject(r));
        else if (command == 'bans')
            verify(message, roleManagerLevel('bans'))
                .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'bans')))
                .catch(r => reject(r));
        else if (command == 'banreverts' || command == 'unbans')
            verify(message, roleManagerLevel('banreverts'))
                .then(() => resolve(common.roleManager.userInfoList(message, (mentionedUser) ? mentionedUser.id : args[0], 'banReverts')))
                .catch(r => reject(r));
        else if (command == 'promote')
            verify(message, roleManagerLevel('promote'))
                .then(() => resolve(common.roleManager.promoteUser(message, (mentionedUser) ? mentionedUser.id : args[0])))
                .catch(r => reject(r));
        else if (command == 'demote')
            verify(message, roleManagerLevel('demote'))
                .then(() => resolve(common.roleManager.demoteUser(message, (mentionedUser) ? mentionedUser.id : args[0])))
                .catch(r => reject(r));
        else if (command =='setbotadmin')
            verify(message, roleManagerLevel('setbotadmin')) 
                .then(() => resolve(common.roleManager.setBotAdmin(message, (mentionedUser) ? mentionedUser.id : args[0])))
                .catch(r => reject(r));

        else if (command == 'blackjack')
            verify(message, minigameLevel('blackjack', 'gambling'))
                .then(() => resolve(common.minigames.run(message, 'gambling', 'blackjack')))
                .catch(r => reject(r));
        else if (command == 'cast')
            verify(message, minigameLevel('cast', 'fishing'))
                .then(() => resolve(common.minigames.run(message, 'fishing', 'cast')))
                .catch(r => reject(r));
        else if (command == 'stats')
            verify(message, minigameLevel('stats'))
                .then(() => resolve(common.minigames.listStats(message)))
                .catch(r => reject(r));
        else if (command == 'inv')
            verify(message, minigameLevel('inv'))
                .then(() => resolve(common.minigames.listInv(message)))
                .catch(r => reject(r));
        else if (command == 'sell')
            verify(message, minigameLevel('sell'))
                .then(() => resolve(common.minigames.sellInv(message)))
                .catch(r => reject(r));
    
        else if (command == 'play')
            verify(message, musicLevel('play'))
                .then(() => resolve(common.music.play(message)))
                .catch(r => reject(r));
        else if (command == 'join')
            verify(message, musicLevel('join'))
                .then(() => resolve(common.music.join(message)))
                .catch(r => reject(r));
        else if (command == 'leave')
            verify(message, musicLevel('leave'))
                .then(() => resolve(common.music.leave(message)))
                .catch(r => reject(r));
        else if (command == 'skip')
            verify(message, musicLevel('skip'))
                .then(() => resolve(common.music.skip(message)))
                .catch(r => reject(r));
        else if (command == 'stop')
            verify(message, musicLevel('stop'))
                .then(() => resolve(common.music.stop(message)))
                .catch(r => reject(r));
        else if (command == 'queue' || command == 'q')
            verify(message, musicLevel('queue'))
                .then(() => resolve(common.music.listQueue(message)))
                .catch(r => reject(r));
        else if (command == 'playlist' || command == 'pl')
            common.music.playlistCommand(message, args)
                .then(s => resolve(s))
                .catch(r => reject(r));

        else if (command == 'f')
            verify(message, memeLevel('f'))
                .then(() => resolve(common.memes.memeDispatch(message, 'f')))
                .catch(r => reject(r));
        else if (command == 'fuck')
            verify(message, memeLevel('fuck'))
                .then(() => resolve(common.memes.memeDispatch(message, 'fuuu')))
                .catch(r => reject(r));
        else if (command == 'yey')
            verify(message, memeLevel('yey'))
                .then(() => resolve(common.memes.memeDispatch(message, 'yey')))
                .catch(r => reject(r));
        else if (command == 'penguin')
            verify(message, memeLevel('penguin'))
                .then(() => resolve(common.memes.memeDispatch(message, 'penguin')))
                .catch(r => reject(r));
        else if (command == 'crabrave' || command == 'cr')
            verify(message, memeLevel('crabrave'))
                .then(s => {
                    message.content = '.play https://www.youtube.com/watch?v=LDU_Txk06tM'
                    common.music.play(message);
                    resolve(s);
                })
                .catch(r => reject(r));
        else reject(null);
    });
}