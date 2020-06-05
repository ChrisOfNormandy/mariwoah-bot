const client = require('../global/startup').client;
const music = require('../../../../music/adapter');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getMessageFromVC(serverID) {
    if (!client.guilds.has(serverID)) {
        return console.log("bad serverID");
    }

    let channels = client.guilds.get(serverID).channels;
    let message = null;
    let firstTextChannel = null;

    for (let [id, channel] of channels) {
        if (message !== null)
            break;

        if (channel.type == 'text' && firstTextChannel === null)
            firstTextChannel = channel;

        if (channel.type != 'voice')
            continue;

        let members = channel.members;

        message = members.first().lastMessage || {
            guild: client.guilds.get(serverID),
            channel: firstTextChannel,
            author: members.first().user,
            member: members.first()
        }
    }

    return message;
}

function playSong(serverID, songString) {
    console.log(`Playing song: ${songString}`)
    
    let message = getMessageFromVC(serverID);

    if (!message) {
        return console.log("no message");
    }

    if (!songString.includes('youtube.com/watch?')) {
        music.append.byName(message, songString)
    }
    else {
        music.append.byURL(message, songString)
    }
}

function query() {
    rl.question("Execute:", (input) => {
        let arr = input.split(', ');

        switch (arr[0]) {
            case 'playsong': {
                playSong(arr[1], arr[2]);
                break;
            }
            case 'stopsong': {
                try {
                    let message = getMessageFromVC(arr[1]);
                    music.stop(message);
                }
                catch (e) {
                    console.log(e.message);
                }
                break;
            }
        }

        query();
    });
}

module.exports = {
    query
}
