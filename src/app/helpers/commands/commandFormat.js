function valid(values, content, options = {}) {
    return {values, content, options};
}

function error(rejections, content) {
    return {rejections, content};
}

module.exports = {
    valid,
    error
}