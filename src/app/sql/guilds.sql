create table GUILDS (
    server_id varchar(18) not null,
    name varchar(32) not null,
    timestamp varchar(13) not null,
    members int default 0,
    invite_only boolean default true,
    icon varchar(255) default '',
    limbo boolean default true,
    text_assets json,
    primary key (server_id, name)
);

create table GUILD_ALLIANCES (
    server_id varchar(18),
    guild_a_name varchar(32),
    guild_b_name varchar(32),
    timestamp varchar(13) not null,
    primary key (server_id, guild_a_name, guild_b_name)
);

create table GUILD_RIVALRIES (
    server_id varchar(18),
    guild_a_name varchar(32),
    guild_b_name varchar(32),
    timestamp varchar(13) not null,
    primary key (server_id, guild_a_name, guild_b_name)
);