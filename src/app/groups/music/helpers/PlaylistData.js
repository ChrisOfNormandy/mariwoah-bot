const Discord = require('discord.js');
const { handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = require('discord.js');
const SongData = require('./SongData');

module.exports = class PlaylistData {

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

    setSize(size) {
        this.size = size;

        return this;
    }

    setViews(views) {
        this.views = views;

        return this;
    }

    setDate(date) {
        this.date = date;

        return this;
    }

    setRequestedBy(user) {
        this.requestedBy = user;

        return this;
    }

    setImage(image) {
        this.image = image;

        return this;
    }

    setThumbnail(thumbnail) {
        this.thumbnail = thumbnail;

        return this;
    }

    addVideo(...videos) {
        this.videos.push(
            ...videos.map((video) => new SongData(video))
        );

        return this;
    }

    remove() {
        this.removed = true;

        return this;
    }

    getEmbed() {
        this.embed = new Discord.MessageEmbed()
            .setTitle(this.title)
            .setColor(handlers.chat.colors.youtube)
            .setURL(this.url);

        if (this.image)
            this.embed.setImage(this.image);
        else if (this.thumbnail)
            this.embed.setThumbnail(this.thumbnail);

        if (this.videos.length) {
            let slice = this.videos.slice(0, 10);

            let str = [];
            slice.forEach((video, i) => {
                str.push(`${i + 1}. ${video.title}`);
            });

            if (this.videos.length > 10)
                str.push(`... and ${this.videos.length - 10} more.`);

            this.embed.addField('Available to Play', str.join('\n'));
        }

        return this.embed;
    }

    constructor(playlistData) {
        this.title = playlistData.title || 'Unknown';
        this.id = playlistData.listId || null;
        this.url = (playlistData.url || `https://www.youtube.com/playlist?listId=${playlistData.listId}`) || null;
        this.size = playlistData.size || 0;
        this.views = playlistData.views || 0;
        this.image = playlistData.image || 0;
        this.thumbnail = playlistData.thumbnail || null;

        /**
         * @type {SongData[]}
         */
        this.videos = [];

        if (playlistData.videos.length)
            this.addVideo(...playlistData.videos);

        this.requestedBy = null;

        this.removed = false;

        this.embed = new MessageEmbed();
    }
};