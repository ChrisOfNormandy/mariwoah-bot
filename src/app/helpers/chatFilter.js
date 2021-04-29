const Discord = require('discord.js');

const banned = require('./filter/banned.json');
const kicked = require('./filter/kicked.json');
const warned = require('./filter/warned.json');

const filterBypass = require('./filter/bypassRoleNames.json');

let banReg = '';
banned.forEach((str, i) => {
    banReg += `(${str}\\b)`;
    if (i < banned.length - 1)
        banReg += '|'
});

const bannedRegex = new RegExp(banReg, 'g');

let kickReg = '';
kicked.forEach((str, i) => {
    kickReg += `(${str}\\b)`;
    if (i < kicked.length - 1)
    kickReg += '|'
});

const kickedRegex = new RegExp(kickReg, 'g');

let warnReg = '';
warned.forEach((str, i) => {
    warnReg += `(${str}\\b)`;
    if (i < warned.length - 1)
    warnReg += '|'
});

const warnedRegex = new RegExp(warnReg, 'g');

function unique(arr) {
    let list = [];
    arr.forEach(str => {
        if (!list.includes(str))
            list.push(str);
    });
    return list.length;
}

/**
 * 
 * @param {Discord.Message} message 
 */
function ban(message, reason = null) {
    return message.member.ban({reason: reason === null ? 'Chat filter violation.' : reason})
}

/**
 * 
 * @param {Discord.Message} message 
 */
 function kick(message, reason = null) {
    return message.member.kick({reason: reason === null ? 'Chat filter violation.' : reason})
}


/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = (message) => {
    if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_MESSAGES') || !!message.member.roles.cache.filter(role => { return filterBypass.includes(role.name.toLowerCase())}).size)
        return true;

    let banctx = message.content.match(bannedRegex);
    let kickctx = message.content.match(kickedRegex);
    let warnctx = message.content.match(warnedRegex);

    if (banctx !== null) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Hello.')
            .addField(`Ban report:`, `You were automatically banned from ${message.guild.name} for chat filter violations.`)
            .addField(`Reason:`, `Message contained "${banctx.join('", "')}"`)
            .addField(`Duration of ban:`, unique(banctx) * banctx.length * 3);

        message.author.send(embed)
            .catch(() => console.log('Could not send user a DM.'));


        ban(message)
            .then(() => message.channel.send(`<@!${message.author.id}> has been banned for chat violation.`))
            .catch(err => console.error(err));

        return false;
    }
    
    if (kickctx !== null) {
        message.channel.send(`<@!${message.author.id}> has been kicked for chat violation.`);

        const embed = new Discord.MessageEmbed()
            .setTitle('Hello.')
            .addField(`Kick report:`, `You were automatically kicked from ${message.guild.name} for chat filter violations.`)
            .addField(`Reason:`, `Message contained "${kickctx.join('", "')}"`);

        message.author.send(embed)
            .catch(() => console.log('Could not send user a DM.'));


        kick(message)
            .then(() => message.channel.send(`<@!${message.author.id}> has been kicked for chat violation.`))
            .catch(err => console.error(err));

        return false;
    }

    if (warnctx !== null) {
        let msg = message.content;
        warned.forEach(str => msg = msg.replace(str, `||${str}||`));
        message.channel.send(`<@!${message.author.id}> has been issued a warning for chat violation.\n> ${msg}`);

        const embed = new Discord.MessageEmbed()
            .setTitle('Hello.')
            .addField(`Warning report:`, `You were issued a warning from ${message.guild.name} for chat filter violations.`)
            .addField(`Reason:`, `Message contained "${warnctx.join('", "')}"`);

        message.author.send(embed)
            .catch(() => console.log('Could not send user a DM.'));

        return false;
    }
        
    return true;
}