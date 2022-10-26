// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

const Queue = require('../../helpers/Queue');

const queue = {
    /**
     * @type {Map<string, Queue>}
     */
    map: new Map(),

    /**
     * 
     * @param {string} guildId 
     * @param {Discord.VoiceBasedChannel} voiceChannel 
     * @returns 
     */
    add(guildId, voiceChannel) {
        const q = new Queue(voiceChannel);
        this.map.set(guildId, q);

        return q;
    },

    /**
     * 
     * @param {string} guildId 
     * @returns 
     */
    get(guildId) {
        return this.map.get(guildId);
    },

    /**
     * 
     * @param {string} guildId 
     * @returns 
     */
    exists(guildId) {
        return this.map.has(guildId);
    },

    /**
     * 
     * @param {string} guildId 
     * @returns 
     */
    delete(guildId) {
        return this.map.delete(guildId);
    }
};

module.exports = queue;