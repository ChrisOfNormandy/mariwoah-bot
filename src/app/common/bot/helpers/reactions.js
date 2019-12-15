const nice = ['🇳', '🇮', '🇨', '🇪'];

function reactNice(message, index) {    
    if (index < nice.length) {
        message.react(nice[index]);
        setTimeout(() => reactNice(message, index + 1), 1000);
    }
    else return;
}

module.exports = function(message) {
    if (message.content.includes('69'))
        reactNice(message, 0);
}