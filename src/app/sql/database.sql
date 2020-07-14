create table SERVERS (
    id varchar(18) not null,
    motd varchar(255) default 'A First Title&tSome message.\nA new line|Second Title&tSome message.<l>http://google.com/',
    prefix varchar(1) default '~',
    admin varchar(18),
    moderator varchar(18),
    helper varchar(18),
    vip varchar(18),
    bot varchar(18),
    primary key (id)
);

create table USERS (
    server_id varchar(18) not null,
    user_id varchar(18) not null,
    permission_level tinyint default 0,
    bot_role enum('admin', 'mod', 'helper'),
    primary key (server_id, user_id),
    foreign key (server_id) references SERVERS(id)
);

create table STATS (
    server_id varchar(18) not null,
    user_id varchar(18) not null,
    balance int default 0,
    level tinyint default 0,
    experience int default 0,
    primary key (server_id, user_id),
    foreign key (server_id, user_id) references USERS(server_id, user_id)
);

create table PUNISHMENTS (
    server_id varchar(18) not null,
    user_id varchar(18) not null,
    type enum('warn', 'kick', 'ban') not null,
    duration int default 0,
    severity enum('normal', 'soft', 'hard') default 'normal',
    reason varchar(255) default '',
    ticket_id varchar(13) not null,
    pardoned boolean default false,
    staff_id varchar(18),
    username varchar(255),
    datetime datetime,
    primary key (server_id, user_id, type, ticket_id),
    foreign key (server_id, user_id) references USERS(server_id, user_id),
    foreign key (server_id, staff_id) references USERS(server_id, user_id)
);

create table PLAYLISTS (
    server_id varchar(18) not null,
    name varchar(32) not null,
    list json,
    duration int default 0,
    creator_id varchar(18),
    primary key (server_id, name),
    foreign key (server_id, creator_id) references USERS(server_id, user_id)
);

create table MINIGAME_FISHING (
    server_id varchar(18) not null,
    user_id varchar(18) not null,
    level int default 0,
    catches int default 0,
    misses int default 0,
    inventory json,
    primary key (server_id, user_id),
    foreign key (server_id, user_id) references USERS(server_id, user_id)
);

create table MINIGAME_DATA_ITEMS_FISH (
    item_name varchar(64) not null,
    item_meta_id int default 0,
    rarity int not null,
    slope decimal(10,5) not null,
    intercept decimal(10,5) not null,
    length decimal(10,5) not null,
    price_per_pound decimal(10,5) not null,
    primary key (item_name, item_meta_id)
);

create table MINIGAME_DATA_ITEMS_TRASH (
    item_name varchar(64) not null,
    item_meta_id int default 0,
    rarity int not null,
    price decimal not null,
    primary key (item_name, item_meta_id)
);

create table STATS_FISHING (
    server_id varchar(18),
    user_id varchar(18),
    level tinyint default 0,
    experience int default 0,
    catches int default 0,
    misses int default 0,
    trash int default 0,
    primary key (server_id, user_id)
);

create table STATS_INVENTORIES (
    server_id varchar(18),
    user_id varchar(18),
    items json,
    primary key (server_id, user_id)
);
