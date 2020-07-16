const mysql = require('mysql');
const config = require('../../../../private/config');

const db_config = {
    host: "localhost",
    user: config.sql.username,
    password: config.sql.password,
    database: config.sql.database
};

function onDisconnect() {
    const con = mysql.createConnection(db_config);

    con.connect((err) => {
        if (err) {
            console.log('Error connecting to database. Retrying in 10 seconds.');
            console.log(err);
            setTimeout(onDisconnect(), 10000);
        }
        else
            console.log('Connected to the SQL server.');
    });

    con.on('error', (err) => {
        console.log('Database error;', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            onDisconnect();
        else {
            console.log('Disconnect was not connection lost error; retrying in 30 seconds.');
            onDisconnect();
        }
    });

    return con;
}

let con = startup();

function startup() {
    return onDisconnect();
}

module.exports = {
    con,
    startup
}