const config = require('./config');

module.exports = async function (message) {
    let channel = message.channel;

    if (channel.type == 'text') {
        channel.fetchMessages().then(messages => {
            const botMessages = messages.filter(msg => 
                (
                    msg.author.bot
                )
            );
            channel.bulkDelete(botMessages);
            messagesDeleted = botMessages.array().length; // number of messages deleted
    
            // Logging the number of messages deleted on both the channel and console.
            console.log('Deletion of messages successful. Total messages deleted: ' + messagesDeleted);
            channel.send("Deletion of messages successful. Total messages deleted: " + messagesDeleted)
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
        message.delete();
    }
}