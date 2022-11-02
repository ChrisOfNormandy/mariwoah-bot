const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed, createField } = handlers.embed;

/**
 *
 * @param {string} name
 * @param {string} joinDate
 * @param {string} roleList
 * @param {Discord.GuildMember} member
 * @returns
 */
function formatEmbed(name, joinDate, roleList, member) {
    const user = member.user;
    let n = name;

    if (user.bot)
        n += ' -=[BOT]=-';

    let embed = new MessageEmbed()
        .setTitle(n)
        .setColor(handlers.chat.colors.information)
        .addField(
            createField('Join date', joinDate),
            createField('Roles', roleList, true),
            createField('Admin', member.permissions.has('Administrator')
                ? 'Yes'
                : 'No', true)
        );

    return embed;
}

/**
 *
 * @param {Date} date
 * @returns {string}
 */
function getDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

/**
 *
 * @param {Discord.GuildMember} member
 * @returns {string}
 */
function getRoles(member) {
    let roles = '',
        count = 0;

    member.roles.cache.forEach((role) => {
        roles += `${role}`;
        if (member.roles.cache.size > 1 && count < member.roles.cache.size - 1)
            roles += ', ';

        count++;
    });

    return roles;
}

module.exports = {
    /**
     *
     * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
     * @returns {Promise<Output>}
     */
    self: (data) => {
        const member = data.message.member;
        const user = member.user;
        const joinDate = getDate(new Date(member.joinedTimestamp));
        const roles = getRoles(member, data.message);

        const embed = formatEmbed(`${user.username}#${user.discriminator}`, joinDate, roles, member);

        return new Output().addEmbed(embed).setValues(user).resolve();
    },

    /**
     *
     * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
     * @returns {Promise<Output>}
     */
    member: (data) => {
        const user = data.message.mentions.users.first();
        const member = data.message.guild.member(user);
        const joinDate = getDate(new Date(member.joinedTimestamp));
        const roles = getRoles(member, data.message);

        const embed = formatEmbed(`${user.username}#${user.discriminator}`, joinDate, roles, member);

        return new Output().addEmbed(embed).setValues(user).resolve();
    }
};