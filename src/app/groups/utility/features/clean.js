const { chatFormat, output } = require('../../../helpers/commands');

// Converts Discord timestamp to a nice date-time format
function timestampToDate(timestamp) {
    return new Date(timestamp);
}

// Gets the age of a message by comparing original (a) to current (b)
function getAge(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const r = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    return r;
}

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
                            .then(msgs => resolve(output.valid([userMessagesDeleted], [chatFormat.response.cleanChat.user(user, userMessagesDeleted)], { clear: 10 })))
                            .catch(err => reject(output.error([err], [err.message])));
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
                        .then(msgs => resolve(output.valid([botMessagesDeleted, cmdMessagesDeleted], [chatFormat.response.cleanChat.all(botMessagesDeleted, cmdMessagesDeleted)], { clear: 10 })))
                        .catch(err => reject(output.error([err], [err.message])));
                }
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
};