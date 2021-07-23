const Discord = require('discord.js');
const { FactionMember, Faction, faction } = require('../../../objects/Faction');
const getList = require('./getList');

const cache = {
    guilds: new Map(),

    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {string} factionName 
     * @returns {Promise<Faction>}
     */
    set: (guild, factionName) => {
        if (!cache.guilds.has(guild.id))
            cache.guilds.set(guild.id, { cache: new Map() });

        return new Promise((resolve, reject) => {
            faction.fetch(guild.id, factionName)
                .then(json => {
                    let faction = new Faction(guild, factionName);
                    faction.build(json)
                        .then(faction => {
                            cache.guilds.get(guild.id).cache.set(factionName, faction);

                            faction.getMembers().forEach(user => {
                                if (guild.members.cache.has(user.id)) {
                                    let member = guild.members.cache.get(user.id);
                                    user.nickname = member.nickname;
                                    user.username = member.user.username;
                                }
                            });

                            faction.upload()
                                .then(() => resolve(faction))
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                })
                .catch(() => {
                    let faction = new Faction(guild, factionName);

                    cache.guilds.get(guild.id).cache.set(factionName, faction);

                    faction.upload()
                        .then(() => resolve(faction))
                        .catch(err => reject(err));
                });
        });
    },

    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {string} factionName 
     * @returns {Promise<Faction>}
     */
    get: (guild, factionName, options = {}) => {
        if (!cache.guilds.has(guild.id))
            cache.guilds.set(guild.id, { cache: new Map() });

        if (!cache.guilds.get(guild.id).cache.has(factionName)) {
            return new Promise((resolve, reject) => {
                if (!options.ignoreFecth)
                    faction.fetch(guild.id, factionName)
                        .then(json => {
                            let faction = new Faction(guild, factionName);
                            faction.build(json)
                                .then(faction => {
                                    cache.guilds.get(guild.id).cache.set(factionName, faction);
                                    faction.upload()
                                        .then(() => resolve(faction))
                                        .catch(err => reject(err));
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                else
                    reject(new Error('Faction not saved in cache.'));
            });
        }

        return Promise.resolve(cache.guilds.get(guild.id).cache.get(factionName));
    },

    /**
     * 
     * @param {Discord.Guild} guild 
     * @param {string} factionName 
     * @param {Discord.GuildMember} member 
     */
    delete: (guild, factionName, member) => {
        if (member.hasPermission('ADMINISTRATOR')) {
            return new Promise((resolve, reject) => {
                faction.remove(guild.id, factionName)
                    .then(() => {
                        if (!cache.guilds.has(guild.id))
                            cache.guilds.set(guild.id, { cache: new Map() });

                        cache.guilds.get(guild.id).cache.delete(factionName);

                        resolve(true);
                    })
                    .catch(err => reject(err));
            });
        }
        else
            return Promise.reject(new Error('Member lacks permissions.'));
    },

    members: {
        /**
         * 
         * @param {Discord.Guild} guild
         * @param {string} factionName 
         * @param {Discord.GuildMember} member 
         * @returns {Promise<FactionMember>}
         */
        set: (guild, factionName, member) => {
            return new Promise((resolve, reject) => {
                cache.get(guild, factionName)
                    .then(faction => {
                        faction.addMember(member)
                            .then(m => {
                                faction.upload()
                                    .then(() => resolve(m))
                                    .catch(err => reject(err));
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        },

        /**
         * 
         * @param {Discord.Guild} guild
         * @param {string} id 
         * @param {string} factionName 
         * @returns {Promise<FactionMember | FactionMember[]>}
         */
        get: (guild, id, factionName = null) => {
            if (!cache.guilds.has(guild.id))
                cache.guilds.set(guild.id, { cache: new Map() });

            return new Promise((resolve, reject) => {
                if (factionName === null) {                   
                    getList(guild)
                        .then(list => {
                            let factions = [];
                            list.forEach(name => factions.push(cache.get(guild, name)));

                            Promise.all(factions)
                                .then(factions => {
                                    let list = [];

                                    factions.forEach(faction => {
                                        let m = faction.getMember(id);
                                        if (m !== null)
                                            list.push(faction);
                                    });

                                    resolve(list);
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                }
                else {
                    if (!cache.guilds.get(guild.id).cache.has(factionName))
                        reject(new Error('Cache does not contain requested faction.'));
                    else {
                        cache.guilds.get(guild.id).cache.get(factionName).getMember(id)
                            .then(m => resolve(m))
                            .catch(err => reject(err));
                    }
                }
            });
        }
    }
};

module.exports = cache;