const ytdl = require('ytdl-core');
const queue = require('../../../../music/queue');
const alertList = require('./alertsQueue');

playSound = async function(vc, url) {
    let connection = await vc.join();
    const dispatcher = connection.playStream(ytdl(url,{filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), {highWaterMark: 1})
    .on('error', (err) => {
        console.log(err);
        vc.leave();
    })
    dispatcher.setVolumeLogarithmic(0.4);
}

module.exports = async function(client, oldMember, newMember) {
    if (queue.serverQueue) {
        console.log('Not playing join sound because music is playing.');
        return;
    }

    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        // User entered channel
        // console.log(newMember);
        if (alertList.map.has(newMember.user.id)) return;
        let userUrls = {
            '188020615989428224': 'https://www.youtube.com/watch?v=7nQ2oiVqKHw',
            '409942399779864586': 'https://www.youtube.com/watch?v=RHYOZaQuqtM',
            '283830111461965824': 'https://www.youtube.com/watch?v=z-uKCHfU5mw',
            '240088084010631169': 'https://www.youtube.com/watch?v=fx6YsvltpaY',
            '406269592202117131': 'https://www.youtube.com/watch?v=RJqE_1rWNz0'
        }
        let url = (userUrls[newMember.user.id]) ? userUrls[newMember.user.id] : null;
        if (url == null) return;

        const vc = client.guilds.get('517982323979976714').members.get(newMember.user.id).voiceChannel;
        
        
        if (alertList.map.size == 0) alertList.map.set(newMember.user.id, url);
        else {
            alertList.map = new Map();
            return;
        }

        playSound(vc, url);
        alertList.map.delete(newMember.user.id);
    }
    else if (newUserChannel === undefined) {
        // User left channel
        // console.log(newMember.user);
    }
}