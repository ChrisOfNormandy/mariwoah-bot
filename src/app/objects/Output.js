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
        return (this.error !== null && this.error.message !== undefined) ? [this.error.message] : this.content || [];
    }

    /**
     * 
     * @param {string} key 
     * @param {*} value 
     */
    setOption(key, value) {
        this.options[key] = value;
        return this;
    }

    /**
     * 
     * @returns {object}
     */
    getOptions() {
        return this.options;
    }

    /**
     * 
     * @param  {...any} content 
     */
    constructor(...content) {
        this.content = content;
        this.error = null;
        this.values = [];
        this.options = {};
    }
}

module.exports = Output;