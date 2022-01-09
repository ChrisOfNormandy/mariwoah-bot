"use strict";
class Output {
    /**
     *
     * @param  {...any} values
     * @returns {Output}
     */
    setValues(...values) {
        this.values = values;
        return this;
    }
    /**
     *
     * @param {Error} error
     * @returns {Output}
     */
    setError(error) {
        this.error = error;
        return this;
    }
    /**
     *
     * @returns {Error[]}
     */
    getErrors() {
        return this.error;
    }
    /**
     *
     * @returns {any[]}
     */
    getContent() {
        return (this.error !== null && this.error.message !== undefined)
            ? [this.error.message]
            : this.content || [];
    }
    /**
     *
     * @param {string} key
     * @param {*} value
     */
    setOption(key, value) {
        this.options.set(key, value);
        return this;
    }
    /**
     *
     * @param {string} key
     * @returns {*}
     */
    getOption(key) {
        return this.options.get(key);
    }
    /**
     *
     * @param  {...any} content
     */
    constructor(...content) {
        this.content = content;
        this.error = null;
        this.values = [];
        /**
         * @type {Map<string, *>}
         */
        this.options = new Map();
    }
}
module.exports = Output;
