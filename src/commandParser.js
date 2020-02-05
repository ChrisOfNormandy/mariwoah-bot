const common = require('./app/common/core');
const roleManager = require('./app/common/roleManager/adapter')

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
    const msgArray = message.content.split(' ');
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        // Common
        case 'ping': {
            if (await verify(message, 0)) common.bot.ping(message, common.client);
            else return;
            break;
        }
        case 'clean': {
            if (await verify(message, 2)) common.bot.cleanChat(message);
            else return;
            break;
        }
        case '?': {}
        case 'help': {
            if (await verify(message, 0)) common.bot.listHelp(message);
            else return;
            break;
        }
        case 'whoami': {
            if (await verify(message, 1)) common.bot.whoami(message);
            else return;
            break;
        }
        case 'whoareyou': {
            if (await verify(message, 1)) common.bot.whoareyou(message);
            else return;
            break;
        }
        case 'roll': {
            if (await verify(message, 0)) common.roll(message, args);
            else return;
            break;
        }

        // RoleManager
        case 'warn': {
            if (await verify(message, 2)) common.roleManager.modUserByString(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0], 'warn', {reason: args.slice(1).join(' ')});
            else return;
            break;
        }

        /*case 'dismiss': {
            if (await verify(message, 2)) common.roleManager.modUserByString(message, message.mentions.users.first().id, 'dismiss', {reason: args.slice(1).join(' ')});
            else return;
            break;
        }*/

        case 'kick': {
            if (await verify(message, 3)) common.roleManager.kickUser(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0]);
            else return;
            break;
        }

        case 'ban': {
            if (await verify(message, 4)) common.roleManager.banUser(message, (message.mentions.users.first()) ? message.mentions.users.first().id : args[0]);
            else return;
            break;
        }
        case 'unban': {
            if (await verify(message, 4)) common.roleManager.unbanUser(message, args[0]);
            else return;
            break;
        }

        case 'fetchbans': {
            if (await verify(message, 3)) common.roleManager.fetchBans(message);
            else return;
            break;
        }

        case 'rm_reset': {
            if (message.member.hasPermission("ADMINISTRATOR")) common.roleManager.modUserByString(message, message.guild.members.get((message.mentions.members.first()) ? message.mentions.members.first().id : args[0]), 'reset', {});
            else message.channel.send('Only administrators can use that command.');
            break;
        }
        case 'rm-info': {
            if (await verify(message, 2)) common.roleManager.userInfo(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0]);
            else return;
            break;
        }
        case 'rm-roleinfo': {
            if (await verify(message, 2)) common.roleManager.userRoleInfo(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0]);
            else return;
            break;
        }
        case 'warnings': {
            if (await verify(message, 2)) common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'warnings');
            else return;
            break;
        }
        case 'kicks': {
            if (await verify(message, 2)) common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'kicks');
            else return;
            break;
        }
        case 'bans': {
            if (await verify(message, 2)) common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'bans');
            else return;
            break;
        }
        case 'banreverts': {
            if (await verify(message, 2)) common.roleManager.userInfoList(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0], 'banReverts');
            else return;
            break;
        }
        case 'promote': {
            if (await verify(message, 4)) common.roleManager.promoteUser(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0]);
            else return;
            break;
        }
        case 'demote': {
            if (await verify(message, 4)) common.roleManager.demoteUser(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0]);
            else return;
            break;
        }

        case 'motd': {
            if (await verify(message, 0)) common.roleManager.motd(message);
            else return;
            break;
        }

        case 'setmotd': {
            if (await verify(message, 4)) common.roleManager.setmotd(message, args);
            else return;
            break;
        }

        case 'setbotadmin': {
            if (message.member.hasPermission("ADMINISTRATOR")) common.roleManager.setBotAdmin(message, (message.mentions.members.first()) ? message.mentions.members.first().id : args[0]);
            else {
                message.channel.send('Only users with Discord server admin permissions can use that command.');
                return;
            }
            break;
        }

        // Minigames
        case 'blackjack': {
            if (await verify(message, 1)) common.minigames.run(message, 'gambling', 'blackjack');
            else return;
            break;
        }
        case 'cast': {
            if (await verify(message, 1)) common.minigames.run(message, 'fishing', 'cast');
            else return;
            break;
        }
        case 'stats': {
            if (await verify(message, 1)) common.minigames.listStats(message);
            else return;
            break;
        }
        case 'inv': {
            if (await verify(message, 1)) common.minigames.listInv(message);
            else return;
            break;
        }
        case 'sell': {
            if (await verify(message, 1)) common.minigames.sellInv(message);
            else return;
            break;
        }

        // Music
        case 'play': {
            if (await verify(message, 1)) common.music.play(message);
            else return;
            break;
        }
        case 'join': {
            if (await verify(message, 1)) common.music.join(message);
            else return;
            break;
        }
        case 'leave': {
            if (await verify(message, 1)) common.music.leave(message);
            else return;
            break;
        }
        case 'skip': {
            if (await verify(message, 1)) common.music.skip(message);
            else return;
            break;
        }
        case 'stop': {
            if (await verify(message, 1)) common.music.stop(message);
            else return;
            break;
        }
        case 'q': {}
        case 'queue': {
            if (await verify(message, 1)) common.music.listQueue(message);
            else return;
            break;
        }
        case 'pl': {}
        case 'playlist': {
            if (await verify(message, 1)) common.music.playlistCommand(message, args);
            else return;
            break;
        }

        // Memes
        case 'f': {
            if (await verify(message, 1)) common.memes.memeDispatch(message, 'f');
            else return;
            break;
        }
        case 'fuck': {
            if (await verify(message, 1)) common.memes.memeDispatch(message, 'fuuu');
            else return;
            break;
        }
        case 'yey': {
            if (await verify(message, 1)) common.memes.memeDispatch(message, 'yey');
            else return; 
            break;
        }
        case 'penguin': {
            if (await verify(message, 0)) common.memes.memeDispatch(message, 'penguin');
            else return;
            break;
        }
        case 'cr': {}
        case 'crabrave': {
            if (await verify(message, 1)) {
                message.content = '.play https://www.youtube.com/watch?v=LDU_Txk06tM'
                common.music.play(message);
            }
            else return;
            break;
        }
    }
}