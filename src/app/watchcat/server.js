const net = require('net');

let server;

function startup() {
    server = net.createServer((socket) => {
        console.log('Client connected.');

        socket.on('data', (data) => {
            console.log(data.toString());
        });
        socket.on('error', (err) => {
            console.log(err);
        });
        
        socket.write("VALUE");
        socket.pipe(socket);
        socket.end();
        console.log('Client disconnected.');
    });

    server.on('error', (err) => {
        console.log(err);
    });

    server.listen(25580, '127.0.0.1', () => {
        console.log(`Watchcat running on 25580.`);
    });
}

module.exports = {
    startup
}