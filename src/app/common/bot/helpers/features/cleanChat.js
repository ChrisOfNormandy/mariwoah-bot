const db = require('../../../../sql/adapter');

function timestampToDate(timestamp) {
    return new Date(timestamp);
}

function getAge(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const r = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    return r;
}

module.exports = async function (message) {
    let channel = message.channel;

    if (channel.type == 'text') {
        channel.fetchMessages()
            .then(messages => {
                if (message.mentions.users.first()) {
                    const userMessages = messages.filter(msg => (msg.author.id == message.mentions.users.first().id &&
                        getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14
                    ));

                    let userMessagesDeleted = userMessages.array().length;

                    channel.bulkDelete(userMessages);

                    channel.send(`Deletion of messages successful. Total messages deleted:\nTotal: ${userMessagesDeleted}`)
                        .then(msg => msg.delete(5000))
                        .catch(e => console.log(e));
                }
                else {
                    db.server.getPrefix(message.channel.guild.id)
                        .then(prefix => {
                            const botMessages = messages.filter(msg => (msg.author.bot &&
                                getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14
                            ));
                            const cmdMessages = messages.filter(msg => (prefix == msg.content.charAt(0) &&
                                getAge(timestampToDate(msg.createdTimestamp), timestampToDate(message.createdTimestamp)) < 14
                            ));
        
                            let botMessagesDeleted = botMessages.array().length;
                            let cmdMessagesDeleted = cmdMessages.array().length;
        
                            channel.bulkDelete(botMessages);
                            channel.bulkDelete(cmdMessages);
        
                            channel.send(`Deletion of messages successful. Total messages deleted:\nBot spam: ${botMessagesDeleted}\nCommands: ${cmdMessagesDeleted}`)
                                .then(msg => msg.delete(5000))
                                .catch(e => console.log(e));
                        })
                    
                }
            })
            .catch(err => console.log('Error while doing bulk delete.', err));
    }
}