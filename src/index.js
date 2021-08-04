module.exports = {
    Command: require('./app/objects/Command'),
    CommandGroup: require('./app/objects/CommandGroup'),
    MessageData: require('./app/objects/MessageData'),
    Output: require('./app/objects/Output'),

    client: require('./app/client'),
    groups: require('./app/groups'),
    chatFormat: require('./app/helpers/commands/chatFormat'),
    helpers: require('./app/helpers'),
    aws: require('./aws/helpers/adapter')
};