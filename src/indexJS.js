const { Bot, Command, CommandGroup, MessageData, Output } = require('./app/objects');

const groups = require('./app/groups');
const handlers = require('./app/handlers');

module.exports = {
    Bot,
    Command,
    CommandGroup,
    MessageData,
    Output,

    groups,
    handlers
};