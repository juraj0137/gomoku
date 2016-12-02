const Server = require('ws').Server;
const uuid = require('node-uuid');

const server = new Server({port: 8087});

let waitingPLayer = null;
let connections = {};
let opponents = {};

server.on('connection', function (ws) {

    ws.onmessage = function (msg) {

        if (msg.type != 'message')
            return;

        let payload = {};
        let type = '';


        try {
            const json = JSON.parse(msg.data);
            type = json.type;
            payload = json.payload;
        } catch (e) {
            console.log(e)
        }

        console.log(type, payload);

        if (type == 'fetch-game') {

            connections[payload.player.id] = ws;

            if (waitingPLayer == null) {
                waitingPLayer = {
                    ws: ws,
                    player: payload.player,
                    opponentId: null,
                };
            } else {
                let msg = {
                    type: 'fetch-game-response',
                    payload: {
                        opponent: waitingPLayer.player,
                        playerInTurn: Math.random() > 0.5 ? waitingPLayer.player : payload.player,
                        gameId: uuid.v4()
                    }
                };

                opponents[payload.player.id] = waitingPLayer.player.id;
                opponents[waitingPLayer.player.id] = payload.player.id;

                ws.send(JSON.stringify(msg));
                console.log('me', JSON.stringify(msg));

                msg.payload.opponent = payload.player;
                waitingPLayer.ws.send(JSON.stringify(msg));
                console.log('opponent', JSON.stringify(msg));

                waitingPLayer = null;
            }
        }

        if (type == 'new-move') {
            let opponentId = opponents[payload.move.player.id];
            if (typeof opponentId != "undefined")
                connections[opponentId].send(msg.data);
        }
    }
});
