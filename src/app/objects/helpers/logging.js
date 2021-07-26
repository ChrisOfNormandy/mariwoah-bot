function widthText(char = '#') {
    return char.repeat(process.stdout.columns);
}

function error(err, header = null) {
    console.error(widthText(), `\nAn error has occurred:\n${header !== null ? `${header}` : 'Unknown cause.'}\n`, err, `\n\n${widthText()}`);
}

module.exports = {
    error
};