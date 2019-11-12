const ytdl = require('ytdl-core');
const fs = require('fs');
const global = require('../main/global');

module.exports = {
    queue: new Map(),
    queueContruct: {
        textChannel: null,
        voiceChannel: null,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    },
    previousSong: null,
    serverQueue: null,

    createPlaylist: function (message) {
        const args = message.content.split(' ');
        if (args.length < 3) return;
    
        try {
            const name = args[2];
            const path = `${global.playlistPath}${name}.json`;
    
            fs.access(path, fs.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    console.log("MAKING THE FILE");
                    fs.open(path, 'w', function (err, file) {
                        if (err) return;
                    });
                    message.channel.send('Created playlist with name ' + name + '.');
                    return;
                }
                message.channel.send('Playlist with name ' + name + ' already exists!');
            })
        }
        catch (e) {
            console.log(e);
        }
    },
    
    addToPlaylist: async function (message) {
        let args = message.content.split(' ');
        if (args.length < 4) return;
    
        const name = args[2];
        const path = `${global.playlistPath}${name}.json`;
        const songInfo = await ytdl.getInfo(args[3]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
        console.log(song);
    
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
    
            if (data == '') {
                let obj = {'playlist':[]};
                obj.playlist.push(song);
                let json = JSON.stringify(obj);
                fs.writeFile(path, json, (err, data) => {
                    if (err) {
                        console.log('Error writing to file' + err);
                    }
                })
                return;
            }
            if (data.toString().includes(song.url)) {
                console.log('Playlist already contains item.');
                message.channel.send('Playlist already contains that song!');
                return;
            }
            let obj = JSON.parse(data);
            obj.playlist.push(song);
            let json = JSON.stringify(obj);
            fs.writeFile(path, json, (err, data) => {
                if (err) {
                    console.log('Error writing to file' + err);
                }
            })
        });
    
        message.channel.send(`Added song ${song.title} to the playlist "${name}".`);
    },
    
    getVC: function (message) {
        const vc = message.member.voiceChannel;
        if (!vc) return undefined;
        return vc;
    },
    
    play: function (guild, song) {
        this.serverQueue = this.queue.get(guild.id);
    
        if (!song) {
            this.serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }
        
        const dispatcher = this.serverQueue.connection.playStream(ytdl(song.url,{filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), {highWaterMark: 1})
            .on('end', () => {
                console.log('Music ended!');
                previousSong = song;
                this.serverQueue.songs.shift();
                this.play(guild, this.serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(this.serverQueue.volume / 5);
    },
    
    skip: function (message, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    },
    
    stop: function (message, serverQueue) {
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    },
    
    playSong: async function (message, serverQueue) {
        const args = message.content.split(' ');
    
        const voiceChannel = this.getVC(message);
        if (!voiceChannel) return;
    
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
    
        if (!serverQueue) {
            this.queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
    
            this.queue.set(message.guild.id, this.queueContruct);
    
            this.queueContruct.songs.push(song);
    
            try {
                var connection = await voiceChannel.join();
                this.queueContruct.connection = connection;
                this.play(message.guild, this.queueContruct.songs[0]);
            }
            catch (err) {
                console.log(err);
                this.queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        }
        else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
    },
    
    shuffle: async function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
    
            [array[i], array[j]] = [array[j], array[i]];
        }
    
        return array;
    },
    
    divideArray: async function (array, size) {
        let arraySize = Math.ceil(array.length / size);
        let toReturn = new Array(arraySize);
    
        for (let i = 0; i < arraySize; i++) {
            if (i < arraySize - 1) toReturn[i] = new Array(size);
            else toReturn[i] = new Array(array.length % size);
            for (let k = size * i; k < size * (i + 1); k++) {
                if (array[k]) toReturn[i][k - size * i] = array[k];
            }
        }
        return toReturn;
    },
    
    addToQueue: async function (object, message, serverQueue, doShuffle) {
        const voiceChannel = this.getVC(message);
        if (!voiceChannel) return;
    
        let playlistArray = object.playlist;
    
        if (!serverQueue) {
            this.queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
    
            this.queue.set(message.guild.id, this.queueContruct);
        }
    
        if (doShuffle) {
            playlistArray = await this.shuffle(object.playlist)
            .then(state => {
                console.log('Shuffled playlist successfully.');
    
                for (let i = 0; i < playlistArray.length; i++) {
    
                    const song = {
                        title: playlistArray[i].title,
                        url: playlistArray[i].url
                    };
            
                    try {
                        this.queueContruct.songs.push(song);
                        console.log(`Added ${song.title} to queue.`);
                    }
                    catch (e) {
                        console.log(e);
                        return;
                    }
                }
            })
            .catch(e => {
                console.log(e);
            })
        }
        else {
            console.log('Adding playlist to queue without shuffle.')
            for (let i = 0; i < playlistArray.length; i++) {
    
                const song = {
                    title: playlistArray[i].title,
                    url: playlistArray[i].url
                };
    
                try {
                    this.queueContruct.songs.push(song);
                    console.log(`Added ${song.title} to queue.`);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
            }
        }
    
    
        try {
            var connection = await voiceChannel.join();
            this.queueContruct.connection = connection;
            this.play(message.guild, this.queueContruct.songs[0]);
        }
        catch (err) {
            console.log(err);
            this.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    },
    
    listPlaylist: async function (obj, message, includeLinks) {
        if (obj.playlist.length > 25) {
            arrays = await this.divideArray(obj.playlist, 25);
            console.log(arrays);
            
            for (let k = 0; k < arrays.length; k++) {
                msg = '';
                for (let i = 0; i < obj.playlist.length; i++) {
                    if (!arrays[k][i]) continue;
                    if (includeLinks) {
                        msg += `${k * 25 + i + 1}. ${arrays[k][i].title} | ${arrays[k][i].url}\n`;
                    }
                    else {
                        msg += `${k * 25 + i + 1}. ${arrays[k][i].title}\n`;
                    }
                }
                message.channel.send(msg);
            }
        }
        else {
            msg = '';
            for (let i = 0; i < obj.playlist.length; i++) {
                if (includeLinks) {
                    msg += `${i + 1}. ${obj.playlist[i].title} | ${obj.playlist[i].url}\n`;
                }
                else {
                    msg += `${i + 1}. ${obj.playlist[i].title}\n`;
                }
            }
    
            message.channel.send(msg);
        }
    }
}