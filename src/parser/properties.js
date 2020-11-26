const commands = require('./commands');

function get(command) {
    let filter = commands.filter((obj) => {return obj.commands.includes(command)});
    return (filter.length)
        ? filter[0]
        : null;
}

module.exports = {
    get
}