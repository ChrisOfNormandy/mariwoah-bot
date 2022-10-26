const stream = require('stream');
const { handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;

module.exports = class SongData {

    setTitle(title) {
        this.title = title;

        return this;
    }

    setUrl(url) {
        this.url = url;

        return this;
    }

    setId(id) {
        this.id = id;

        return this;
    }

    setAuthor(author) {
        this.author = author;

        return this;
    }

    setRequestedBy(user) {
        this.requestedBy = user;

        return this;
    }

    setDuration(timestamp, seconds) {
        this.duration.timestamp = timestamp;
        this.duration.seconds = seconds;

        return this;
    }

    setPlaylist(title, url, videoCount) {
        this.playlist.title = title;
        this.playlist.url = url;
        this.playlist.videoCount = videoCount;

        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;

        return this;
    }

    /**
     * 
     * @param {Readable} stream 
     * @returns 
     */
    setStream(stream) {
        this.stream = stream;

        return this;
    }

    remove() {
        this.removed = true;

        return this;
    }

    getResource() {
        const a = new stream.PassThrough();
        const b = new stream.PassThrough();

        this.stream.pipe(a);
        this.stream.pipe(b);

        this.stream = b;

        return handlers.channels.audioPlayer.createResource(a);
    }

    getNext() {
        return this.next;
    }

    getEmbed() {
        this.embed = new MessageEmbed()
            .setTitle(this.title)
            .setColor(handlers.chat.colors.youtube)
            .makeImage(this.thumbnail)
            .setURL(this.url)
            .makeField(this.author, `Duration: ${this.duration.timestamp}`);

        return this.embed;
    }

    constructor(songData) {
        this.title = songData.title || 'Unknown';
        this.id = songData.videoId || null;
        this.url = (songData.url || `https://www.youtube.com/watch?v=${songData.videoId}`) || null;
        this.author = songData.author.name || 'Unknown';
        this.requestedBy = null;
        this.duration = {
            timestamp: null,
            seconds: 0
        };

        /**
         * @type {Readable}
         */
        this.stream = null;

        this.playlist = {
            title: null,
            url: null,
            videoCount: 0
        };

        this.thumbnail = (songData.thumbnail || songData.thumbnailUrl) || null;
        this.removed = false;

        if (songData.duration) {
            this.duration.timestamp = songData.duration.timestamp || null;
            this.duration.seconds = songData.duration.seconds || 0;
        }

        /**
         * @type {SongData}
         */
        this.next = null;

        this.embed = new MessageEmbed();
    }
};