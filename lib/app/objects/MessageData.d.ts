export = MessageData;
declare class MessageData {
    /**
     *
     * @param {Discord.Client} client
     * @param {string} content
     * @param {Discord.GuildMember} member
     * @param {string} prefix
     * @param {Output} ingest
     * @param {MessageData} ingestData
     */
    constructor(client: Discord.Client, content: string, member: Discord.GuildMember, prefix?: string, ingest?: Output, ingestData?: MessageData);
    /**
     *
     * @param {string} content
     */
    build(content: string): void;
    content: string;
    /**
     *
     * @param  {...string} args
     */
    setArguments(...args: string[]): void;
    arguments: any[];
    /**
     *
     * @param {string} cmd
     */
    setCommand(cmd: string): void;
    command: string | null;
    /**
     *
     * @param {string} sCmd
     */
    setSubcommand(sCmd: string): void;
    subcommand: string | null;
    /**
     *
     * @param {string} content
     */
    setContent(content: string): void;
    client: Discord.Client;
    prefix: string;
    variables: any[];
    mentions: any[];
    roles: any[];
    urls: any[];
    flags: Map<any, any>;
    vars: Map<any, any>;
    outputs: string[];
    admin: any;
    hasData: boolean;
    ingest: Output;
    pipedCommand: string | null;
}
