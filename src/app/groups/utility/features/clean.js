const Discord = require('discord.js');
const { Output } = require('@chrisofnormandy/mariwoah-bot');

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

const antiE = /^[eE\n\s]+$/;
/**
 * 
 * @param {string} str 
 */
const antiESpam = (str) => {
    let s = str.replace(/[\n\s]/g, '');
    let e = s.match(/[eE]/g);

    if (e === null)
        return true;

    return e.length / s.length <= 0.5;
};

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
            .then((messages) => {
                if (message.mentions.users.size) {
                    message.mentions.users.forEach((user, id) => {

                        const userMessages = messages.filter((msg) => {
                            return msg.author.id === id && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14 && (data.flags.has('e') && antiE.test(msg.content));
                        });

                        let arr = Array.from(userMessages);
                        arr = data.arguments.length
                            ? arr.slice(0, data.arguments[0])
                            : arr;

                        const userMessagesDeleted = arr.length;

                        channel.bulkDelete(arr)
                            .then((msgs) => resolve(new Output(`Cleared ${userMessagesDeleted} messages.`).setValues(msgs, userMessagesDeleted).setOption('clear', { delay: 10 })))
                            .catch((err) => reject(new Output().setError(err)));
                    });
                }
                else {
                    const prefix = data.prefix;

                    const botMessages = messages.filter((msg) => {
                        return msg.author.bot && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14;
                    });

                    const cmdMessages = messages.filter((msg) => {
                        return (((data.flags.has('e') && antiE.test(msg.content) || (data.flags.has('E') && !antiESpam(msg.content)))) || prefix === msg.content.charAt(0)) && getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14;
                    });

                    let arr1 = botMessages;
                    let arr2 = cmdMessages;

                    // If (!!data.arguments.length) {
                    //     Arr1 = arr1.slice(0, data.arguments[0]);
                    //     Arr2 = arr2.slice(0, data.arguments[0]);
                    // }

                    const botMessagesDeleted = arr1.size;
                    const cmdMessagesDeleted = arr2.size;

                    let arr = [
                        channel.bulkDelete(arr1),
                        channel.bulkDelete(arr2)
                    ];

                    Promise.all(arr)
                        .then((msgs) => resolve(new Output(`Cleared ${botMessagesDeleted} bot messages, ${cmdMessagesDeleted} user messages.`)
                            .setValues(msgs, botMessagesDeleted, cmdMessagesDeleted)
                            .setOption('clear', { delay: 10 })))
                        .catch((err) => reject(new Output().setError(err)));
                }
            })
            .catch((err) => reject(new Output().setError(err)));
    });
};