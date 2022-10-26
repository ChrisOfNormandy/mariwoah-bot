const Discord = require('discord.js');
// const { s3 } = require('../helpers/aws');

const faction = require('./helpers/faction');

class FactionMember {
    /**
     * 
     * @returns {string}
     */
    getId() {
        return this.id;
    }

    /**
     * 
     * @returns {string | null}
     */
    getName() {
        return this.nickname === null
            ? this.username === null
                ? null
                : this.username
            : this.nickname;
    }

    /**
     * 
     * @returns {{id: string, nickname: string, username: string}}
     */
    toJson() {
        return {
            id: this.id,
            nickname: this.nickname,
            username: this.username,
            faction: {
                id: this.faction.id,
                name: this.faction.name
            },
            roles: this.roles
        };
    }

    /**
     * 
     * @param {Faction} faction 
     * @returns {FactionMember}
     */
    setFaction(faction) {
        this.faction = faction;
        return this;
    }

    getRoles() {
        return this.roles;
    }

    addRole(...roles) {
        roles.forEach(role => {
            if (!this.roles.includes(role))
                this.roles.push(role);
        });
        return this;
    }

    hasRole(role) {
        return this.roles.includes(role);
    }

    /**
     * 
     * @param {string} id 
     * @param {string | null} nickname 
     * @param {string | null} username 
     */
    constructor(id, nickname = null, username = null) {
        this.id = id;
        this.nickname = nickname;
        this.username = username;
        this.roles = [];
    }
}

class Faction {
    /**
     * 
     * @returns {string}
     */
    getId() {
        return this.id;
    }

    /**
     * 
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * 
     * @param {Discord.GuildMember} member 
     * @returns {Promise<FactionMember>}
     */
    addMember(member) {
        if (this.getMember(member.id) !== null)
            return Promise.reject(new Error('Member already exists in faction.'));

        let m = new FactionMember(member.id, member.nickname, member.user.username);
        m.setFaction(this);
        this.members.push(m);

        return Promise.resolve(m);
    }

    /**
     * 
     * @param {Discord.GuildMember} member 
     * @returns 
     */
    removeMember(member) {
        if (this.getMember(member.id) === null)
            return Promise.reject(new Error('Member does not exist in faction.'));

        let removed = null;
        this.members.forEach((m, i) => {
            if (m.id === member.id)
                removed = this.members.splice(i, 1);
        });

        return Promise.resolve(removed);
    }

    /**
     * 
     * @param {string} id 
     * @param {string | null} nickname 
     * @param {string | null} username 
     * @returns 
     */
    addMemberById(id, nickname = null, username = null) {
        if (this.getMember(id) !== null)
            return Promise.reject(new Error('Member already exists in faction.'));

        let m = new FactionMember(id, nickname, username);
        m.setFaction(this);
        this.members.push(m);

        return Promise.resolve(m);
    }

    /**
     * 
     * @param {string} id 
     * @returns 
     */
    removeMemberById(id) {
        if (this.getMember(id) === null)
            return Promise.reject(new Error('Member does not exist in faction.'));

        let removed = null;
        this.members.forEach((m, i) => {
            if (m.id === id)
                removed = this.members.splice(i, 1);
        });

        return Promise.resolve(removed);
    }

    /**
     * 
     * @param {string} id
     * @returns {FactionMember | null}
     */
    getMember(id) {
        return this.members.filter(user => { return user.id === id; })[0] || null;
    }

    /**
     * 
     * @returns {FactionMember[]}
     */
    getMembers() {
        return this.members;
    }

    /**
     * 
     * @param {boolean} ignoreMembers
     * @returns {{id: string, name: string, members: {id: string, username: string, nickname: string}[]}}
     */
    toJson() {
        return {
            id: this.id,
            name: this.name,
            members: this.members.map(user => { return user.toJson(); }),
            roleColor: this.roleColor,
            description: this.description,
            iconHref: this.iconHref
        };
    }

    /**
     * 
     * @returns {Promise<AWS.S3.PutObjectOutput>}
     */
    upload() {
        return s3.object.put('mariwoah', `guilds/${this.id}/factions`, `${this.name}.json`, JSON.stringify(this.toJson()));
    }

    /**
     * 
     * @returns {Promise<AWS.S3.DeleteObjectOutput>}
     */
    delete() {
        return faction.remove(this.id, this.name);
    }

    /**
     * 
     * @param {*} json 
     * @returns {Faction}
     */
    build(json) {
        let members = [];
        for (let k in json) {
            if (k === 'members')
                json[k].forEach(user => members.push(this.addMemberById(user.id, user.nickname, user.username)));
            else
                this[k] = json[k];
        }

        if (!members.length) {
            return new Promise((resolve, reject) => {
                this.delete()
                    .then(() => reject(new Error('No members; Deleting.')))
                    .catch(err => reject(err));
            });
        }

        return new Promise((resolve, reject) => {
            Promise.all(members)
                .then(members => {
                    members.forEach((member, i) => {
                        member.addRole(...json.members[i].roles);
                        resolve(this);
                    });
                })
                .catch(err => reject(err));
        });
    }

    /**
     * 
     * @returns {Promise<Faction>}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            faction.fetch(this.id, this.name)
                .then(json => this.build(json)
                    .then(r => resolve(r))
                    .catch(err => reject(err))
                )
                .catch(err => reject(err));
        });
    }

    getRoleColor() {
        return this.roleColor;
    }

    setRoleColor(color) {
        this.roleColor = color;
        return this;
    }

    getIcon() {
        return this.iconHref;
    }

    setIcon(url) {
        this.iconHref = url;
        return this;
    }

    /**
     * 
     * @param {Discord.Guild} guild
     * @param {string} name 
     */
    constructor(guild, name) {
        this.id = guild.id;
        this.name = name;
        /**
         * @type {FactionMember[]}
         */
        this.members = [];

        this.roleColor = null;
        this.iconHref = null;
        this.description = null;
    }
}

module.exports = {
    FactionMember,
    Faction,
    faction
};