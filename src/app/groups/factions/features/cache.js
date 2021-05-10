const guilds = new Map();
const members = new Map();

const get = require('./get');
const set = require('./set');

const cache = {
    set: (guild, factionName, faction) => {
        if (!guilds.has(guild))
            guilds.set(guild, { cache: new Map() });

        guilds.get(guild).cache.set(factionName, faction);

        return set(guild, factionName, faction);
    },
    get: (guild, factionName) => {
        if (!guilds.has(guild))
            guilds.set(guild, { cache: new Map() });

        if (!guilds.get(guild).cache.has(factionName)) {
            return new Promise((resolve, reject) => {
                get(guild, factionName)
                    .then(faction => {
                        for (let user in faction.members)
                            members.set(user, faction.members[user]);

                        cache.set(guild, factionName, faction)
                            .then(r => resolve(faction))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }

        return Promise.resolve(guilds.get(guild).cache.get(factionName));
    },
    members: {
        set: (guild, factionName, member) => {
            return new Promise((resolve, reject) => {
                cache.get(guild, factionName)
                    .then(faction => {
                        if (!members.has(guild))
                            members.set(guild, { cache: new Map() });

                        faction.members[member.id] = member;

                        for (let user in faction.members)
                            members.get(guild).cache.set(user, faction.members[user]);

                        set(guild, factionName, faction)
                            .then(r => resolve(faction))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        },
        get: (guild, id, factionName = null) => {
            if (!members.has(guild))
                members.set(guild, { cache: new Map() });

            if (!members.get(guild).cache.has(id)) {
                return new Promise((resolve, reject) => {
                    if (factionName !== null) {
                        get(guild, factionName)
                            .then(faction => {
                                for (let user in faction.members)
                                    members.get(guild).cache.set(user, faction.members[user]);

                                resolve(members.get(guild).cache.get(id) || null);
                            })
                            .catch(err => reject(err));
                    }
                    else {
                        s3.object.list('mariwoah', `guilds/${message.guild.id}/factions`)
                            .then(res => {
                                let list = [];
                                res.forEach((fac, index) => {
                                    list.push(get(guild, `${path.basename(fac.Key).replace('.json', '')}${index < res.length - 1 ? '\n' : ''}`));
                                });

                                Promise.all(list)
                                    .then(factions => {
                                        factions.forEach(faction => {
                                            cache.set(guild, faction.name, faction);

                                            faction.members.forEach(user => {
                                                cache.members.set(guild, faction.name, faction.members[user]);
                                            });

                                            resolve(members.get(guild).cache.has(id)
                                                ? members.get(guild).cache.get(id)
                                                : null);
                                        });
                                    })
                                    .catch(err => reject(err));
                            })
                            .catch(err => {
                                if (err.KeyCount == 0)
                                    reject(output.error([err], ['There are no factions in this server.\nTry creating one using:\n> ~fc create']));
                                else
                                    reject(output.error([err], [err.message]));
                            });
                    }
                });
            }

            return Promise.resolve(members.get(guild).cache.get(id));
        },

    }
}

module.exports = cache;