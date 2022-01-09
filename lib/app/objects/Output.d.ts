export = Output;
declare class Output {
    /**
     *
     * @param  {...any} content
     */
    constructor(...content: any[]);
    /**
     *
     * @param  {...any} values
     * @returns {Output}
     */
    setValues(...values: any[]): Output;
    values: any[];
    /**
     *
     * @param {Error} error
     * @returns {Output}
     */
    setError(error: Error): Output;
    error: Error | null;
    /**
     *
     * @returns {Error[]}
     */
    getErrors(): Error[];
    /**
     *
     * @returns {any[]}
     */
    getContent(): any[];
    /**
     *
     * @param {string} key
     * @param {*} value
     */
    setOption(key: string, value: any): Output;
    /**
     *
     * @param {string} key
     * @returns {*}
     */
    getOption(key: string): any;
    content: any[];
    /**
     * @type {Map<string, *>}
     */
    options: Map<string, any>;
}
