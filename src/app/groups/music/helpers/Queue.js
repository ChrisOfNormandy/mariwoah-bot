/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const SongData = require('./SongData');

const { handlers } = require('@chrisofnormandy/mariwoah-bot');
const { AudioPlayerStatus, AudioPlayer } = require('@discordjs/voice');
const getEmbedSongInfo = require('./getEmbedSongInfo');

const { audioPlayer } = handlers.channels;

class Queue {

    /**
     *
     * @param {Discord.VoiceBasedChannel} connection
     * @returns
     */
    connect(connection) {
        this.connection = connection;

        this.connection.subscribe(this.player);

        return this;
    }

    status() {
        return this.songs.length > 0;
    }

    /**
     *
     * @param  {...SongData} songs
     * @returns
     */
    add(member, ...songs) {
        let songArr = songs.map((song) => {
            song.requestedBy = member;

            return song;
        });

        this.songs = this.songs.concat(songArr);

        return this;
    }

    play(stream) {
        const resource = audioPlayer.createResource(stream);

        return new Promise((resolve) => {
            this.player.on(AudioPlayerStatus.Playing, () => {
                resolve(this.songs[0].getEmbed());
            });

            this.player.on('error', (error) => {
                console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
            });

            this.player.play(resource);
        });
    }

    current() {
        return this.songs[0];
    }

    next() {
        const cur = this.current();
        if (cur)
            return cur.getNext() || null;

        return null;
    }

    previous() {
        return this.previousSong;
    }

    /**
     *
     * @param {Discord.VoiceBasedChannel} voiceChannel
     */
    constructor(voiceChannel) {
        this.voiceChannel = voiceChannel;

        /**
         * @type {SongData[]}
         */
        this.songs = [];
        this.volume = 5;

        /**
         * @type {SongData}
         */
        this.previousSong = null;

        this.connection = null;
        /**
         * @type {AudioPlayer}
         */
        this.player = audioPlayer.create();
    }
}

module.exports = Queue;