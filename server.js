const Server = require('ws').Server;

const server = new Server({port: 8087});

server.on('connection', function (ws) {
    console.log('new connection')

    ws.send('something');

});