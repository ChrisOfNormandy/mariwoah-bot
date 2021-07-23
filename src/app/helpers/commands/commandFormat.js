function valid(values, content, options = {}) {
    return { values, content, options };
}

function error(rejections, content = null) {
    return content === null
        ? { rejections, content: rejections.map(err => { return err.message || 'Unknown error. '; }) }
        : { rejections, content };
}

module.exports = {
    valid,
    error
};