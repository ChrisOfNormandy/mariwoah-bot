const common = require('./app/common/core');
const roleManager = require('./app/common/roleManager/adapter');
const commandList = require('./app/common/bot/helpers/commandList');

async function verify(message, permissionLevel) {
    if (message.member.hasPermission("ADMINISTRATOR")) return true;

    let verification = await roleManager.verifyPermission(message, message.author.id, permissionLevel);
    if (!verification.status) {
        if (verification.reason) message.channel.send(verification.reason);   
        else message.channel.send('Operation rejected by permission verification.')
        return false;
    }
    return true;
}

module.exports = async function(message) {
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const common = commandList.common.commands;
    const roleMan = commandList.roleManager.commands;
    const music = commandList.music.commands;
    const playlist = commandList.playlist.commands;
    const minigames = commandList.minigames.commands;
    const memes = commandList.memes.commands;

    switch (command) {
        // Common
        case 'ping': return (await verify(message, common.ping.permissionLevel)) ? common.bot.ping(message, common.client) : false;
        case 'clean': return (await verify(message, common.clean.permissionLevel)) ? common.bot.cleanChat(message) : false;
        case '?': {}
        case 'help': return (await verify(message, common.listHelp.permissionLevel)) ? common.bot.listHelp(message) : false;
        case 'whoami': return (await verify(message, common.whoami.permissionLevel)) ? common.bot.whoami(message) : false;
        case 'whoareyou': return (await verify(message, common.whoareyou.permissionLevel)) ? common.bot.whoareyou(message) : false;
        case 'roll': return (await verify(message, common.roll.permissionLevel)) ? common.roll(message, args) : false;
        
        // RoleManager
        case 'setmotd': return (await verify(message, roleMan.setmotd.permissionLevel)) ? common.roleManager.setmotd(message, args) : false;
        case 'motd': return (await verify(message, roleMan.motd.permissionLevel)) ? common.roleManager.motd(message) : false;

        case 'warn': return (await verify(message, 2)) 
            ? common.roleManager.modUserByString(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0], 'warn', {reason: args.slice(1).join(' ')})
            : false;
        case 'kick': return (await verify(message, 3))
                ? common.roleManager.kickUser(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0])
                : false;
        case 'ban': return (await verify(message, 4)) 
            ? common.roleManager.banUser(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0])
            : false;
        case 'unban': return (await verify(message, 4)) 
            ? common.roleManager.unbanUser(message, args[0]) 
            : false;

        /*case 'dismiss': return (await verify(message, 2)) 
            ? common.roleManager.modUserByString(message, message.mentions.users.first().id, 'dismiss', {reason: args.slice(1).join(' ')})
            : false;*/
        case 'rm_reset': return (await verify(message, 4)) 
            ? common.roleManager.modUserByString(message, message.guild.members.get((message.mentions.members.first()) ? message.mentions.members.first().id : args[0]), 'reset', {})
            : false;

        case 'fetchbans': return (await verify(message, 3)) ? common.roleManager.fetchBans(message) : false;
        
        case 'rm-info': return (await verify(message, 2)) 
            ? common.roleManager.userInfo(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0])
            : false;
        case 'rm-roleinfo': return (await verify(message, 2)) 
            ? common.roleManager.userRoleInfo(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0])
            : false;
        case 'warnings': return (await verify(message, 2)) 
            ? common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'warnings')
            : false;
        case 'kicks': return (await verify(message, 2)) 
            ? common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'kicks')
            : false;
        case 'bans': return (await verify(message, 2)) 
            ? common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'bans')
            : false;
        case 'banreverts': return (await verify(message, 2)) 
            ? common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'banReverts')
            : false;

        case 'promote': return (await verify(message, 4)) 
            ? common.roleManager.promoteUser(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0])
            : false;
        case 'demote': return (await verify(message, 4)) 
            ? common.roleManager.demoteUser(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0])
            : false;

        case 'setbotadmin': return (await verify(message, 4)) 
            ? common.roleManager.setBotAdmin(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0])
            : false;

        // Minigames
        case 'blackjack': return (await verify(message, 1)) ? common.minigames.run(message, 'gambling', 'blackjack') : false;
        case 'cast': return (await verify(message, 1)) ? common.minigames.run(message, 'fishing', 'cast') : false;
        case 'stats': return (await verify(message, 1)) ? common.minigames.listStats(message) : false;
        case 'inv': return (await verify(message, 1)) ? common.minigames.listInv(message) : false;
        case 'sell': return (await verify(message, 1)) ? common.minigames.sellInv(message) : false;

        // Music
        case 'play': return (await verify(message, 1)) ? common.music.play(message) : false;
        case 'join': return (await verify(message, 1)) ? common.music.join(message) : false;
        case 'leave': return (await verify(message, 1)) ? common.music.leave(message) : false;
        case 'skip': return (await verify(message, 1)) ? common.music.skip(message) : false;
        case 'stop': return (await verify(message, 1)) ? common.music.stop(message) : false;
        case 'q': {}
        case 'queue': return (await verify(message, 1)) ? common.music.listQueue(message) : false;
        case 'pl': {}
        case 'playlist': return (await verify(message, 1)) ? common.music.playlistCommand(message, args) : false;

        // Memes
        case 'f': return (await verify(message, 1)) ? common.memes.memeDispatch(message, 'f') : false;

        case 'fuck': return (await verify(message, 1)) ? common.memes.memeDispatch(message, 'fuuu') : false;
        case 'yey': return (await verify(message, 1)) ? common.memes.memeDispatch(message, 'yey') : false;
        case 'penguin': return (await verify(message, 0)) ? common.memes.memeDispatch(message, 'penguin') : false;
        case 'cr': {}
        case 'crabrave': return (await verify(message, 1)) 
            ? () => {
                message.content = '.play https://www.youtube.com/watch?v=LDU_Txk06tM'
                common.music.play(message);
            }
            : false;
    }
}