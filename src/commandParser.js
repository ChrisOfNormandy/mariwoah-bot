const common = require('./app/common/core');

module.exports = function(message) {
    const msgArray = message.content.split(' ');
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping': {
            message.channel.send('You rang?')
            .then(msg => msg.edit(`Some stats: Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(common.client.ping)}ms.`))
            .catch(e => console.log(e));
            break;
        }
        case 'blackjack': {
            common.minigames.gambling.blackjack(message);
            break;
        }
        case 'stats': {
            let user = common.minigames.getUser(message);
            //console.log(user);
            break;
        }
        case 'play': {
            common.music.play(message);
            break;
        }
        case 'cr': {}
        case 'crabrave': {
            message.content = '.play https://www.youtube.com/watch?v=LDU_Txk06tM'
            common.music.play(message);
            break;
        }

        case 'join': {
            common.music.join(message);
            break;
        }
        case 'leave': {
            common.music.leave(message);
            break;
        }
        case 'skip': {
            common.music.skip(message);
            break;
        }
        case 'stop': {
            common.music.stop(message);
            break;
        }
        case 'playlist': {
            common.music.playlistCommand(message, args);
            break;
        }
    }
}