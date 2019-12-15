const common = require('./app/common/core');

module.exports = function(message) {
    const msgArray = message.content.split(' ');
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        // Common
        case 'ping': {common.bot.ping(message, common.client); break;}
        case 'clean': {common.bot.cleanChat(message); break;}
        case 'rs': {}
        case 'restart': {
            common.client = common.bot.preStartup();
            message.channel.send('Restarted.');
            break;
        }
        case '?': {}
        case 'help': {common.bot.listHelp(message); break;}
        case 'whoami': {common.bot.whoami(message); break;}
        case 'whoareyou': {common.bot.whoareyou(message); break;}

        // Minigames
        case 'blackjack': {common.minigames.run(message, 'gambling', 'blackjack'); break;}
        case 'cast': {common.minigames.run(message, 'fishing', 'cast'); break;}
        case 'stats': {common.minigames.listStats(message); break;}
        case 'pay': {common.minigames.pay(message.author.id, 1); break;}
        case 'inv': {common.minigames.listInv(message); break;}
        case 'sell': {common.minigames.sellInv(message); break;}

        // Music
        case 'play': {common.music.play(message); break;}
        case 'join': {common.music.join(message); break;}
        case 'leave': {common.music.leave(message); break;}
        case 'skip': {common.music.skip(message); break;}
        case 'stop': {common.music.stop(message); break;}
        case 'q': {}
        case 'queue': {common.music.listQueue(message); break;}
        case 'pl': {}
        case 'playlist': {common.music.playlistCommand(message, args); break;}

        // Memes
        case 'f': {common.memes.memeDispatch(message, 'f'); break;}
        case 'fuck': {common.memes.memeDispatch(message, 'fuuu'); break;}
        case 'yey': {common.memes.memeDispatch(message, 'yey'); break;}
        case 'cr': {}
        case 'crabrave': {
            message.content = '.play https://www.youtube.com/watch?v=LDU_Txk06tM'
            common.music.play(message);
            break;
        }
        case 'furry': {
            message.content = '.play https://www.youtube.com/watch?v=z-uKCHfU5mw'
            common.music.play(message);
            break;
        }
        case 'earrape': {
            message.content = '.play https://www.youtube.com/watch?v=m5bVIyRvqZ0'
            common.music.play(message);
            break;
        }
        case 'turtlesex': {
            message.content = '.play https://www.youtube.com/watch?v=9bnqzXFClRo'
            common.music.play(message);
            break;
        }
    }
}