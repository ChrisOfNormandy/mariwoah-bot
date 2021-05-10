const fc = {
    about: require('./features/about'),
    create: require('./features/create'),
    get: require('./features/get'),
    list: require('./features/list'),
    remove: require('./features/remove'),
    setColor: require('./features/setColor'),
    setIcon: require('./features/setIcon')
}

module.exports = (message, data) => {   
    switch (data.subcommand) {
        case 'about': return fc.about(message, data);
        case 'create': return fc.create(message, data);
        case 'list': return fc.list(message, data);
        case 'remove': return fc.remove(message, data);
        case 'setcolor': return fc.setColor(message, data);
        case 'seticon': return fc.setIcon(message, data);
        default: {
            return Promise.reject({content: ['Command not found.']});
        }
    }    
}