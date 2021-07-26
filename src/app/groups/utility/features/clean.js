const Discord = require('discord.js');
const MessageData = require('../../../objects/MessageData');

const { chatFormat, Output } = require('../../../helpers/commands');

/**
 * 
 * @param {number} timestamp 
 * @returns {Date}
 */
function timestampToDate(timestamp) {
    return new Date(timestamp);
}

/**
 * 
 * @param {Date} a 
 * @param {Date} b 
 * @returns {number}
 */
function getAge(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const r = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    return r;
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns 
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        const channel = message.channel;

        channel.messages.fetch()
            .then(messages => {
                if (!!message.mentions.users.size) {
                    message.mentions.users.forEach((user, id, m) => {
                        const userMessages = messages.filter((msg) => {
                            return msg.author.id == id && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14;
                        });

                        const userMessagesDeleted = userMessages.array().length;

                        channel.bulkDelete(userMessages)
                            .then(msgs => resolve(new Output(chatFormat.response.cleanChat.user(user, userMessagesDeleted)).setValues(msgs, userMessagesDeleted).setOption('clear', 10)))
                            .catch(err => reject(new Output().setError(err)));
                    });
                }
                else {
                    const prefix = data.prefix;

                    const botMessages = messages.filter((msg) => {
                        return msg.author.bot && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14;
                    });

                    const cmdMessages = messages.filter((msg) => {
                        return prefix == msg.content.charAt(0) && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14;
                    });

                    const botMessagesDeleted = botMessages.array().length;
                    const cmdMessagesDeleted = cmdMessages.array().length;

                    let arr = [
                        channel.bulkDelete(botMessages),
                        channel.bulkDelete(cmdMessages)
                    ];

                    Promise.all(arr)
                        .then(msgs => resolve(new Output(chatFormat.response.cleanChat.all(botMessagesDeleted, cmdMessagesDeleted))
                            .setValues(msgs, botMessagesDeleted, cmdMessagesDeleted)
                            .setOption('clear', 10)))
                        .catch(err => reject(new Output().setError(err)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
};