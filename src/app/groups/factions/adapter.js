const fc = {
    about: require('./features/about'),
    create: require('./features/create'),
    get: require('./features/get'),
    list: require('./features/list'),
    setColor: require('./features/setColor')
}

module.exports = (message, data) => {   
    switch (data.subcommand) {
        case 'about': return fc.about(message, data);
        case 'create': return fc.create(message, data);
        case 'list': return fc.list(message, data);
        case 'setcolor': return fc.setColor(message, data);
        default: {
            console.log('DEFAULT');
            return Promise.reject({content: ['Command not found.']});
        }
    }    
}