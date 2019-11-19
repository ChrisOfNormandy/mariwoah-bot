const config = require('../config');

module.exports = async function (message) {
    if (message.channel.type == 'text') {
        message.channel.fetchMessages().then(messages => {
            const botMessages = messages.filter(msg => msg.author.bot || config.settings.prefix.includes(msg.content.charAt(0)) || config.settings.otherPrefixes.includes(msg.content.charAt(0)));
            message.channel.bulkDelete(botMessages);
            messagesDeleted = botMessages.array().length; // number of messages deleted
    
            // Logging the number of messages deleted on both the channel and console.
            console.log('Deletion of messages successful. Total messages deleted: ' + messagesDeleted);
            message.channel.send("Deletion of messages successful. Total messages deleted: " + messagesDeleted)
            .then(msg => {
                msg.delete(5000);
            })
            .catch(e => {
                console.log(e);
            });
            messagesDeleted = 0;
        }).catch(err => {
            console.log('Error while doing Bulk Delete');
            console.log(err);
        });
    }
}