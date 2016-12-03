const Server = require('ws').Server;
const uuid = require('node-uuid');

const server = new Server({port: 8087});

let waitings = {};
let connections = {};
let opponents = {};
let playerToFriendlyGame = {};

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

        console.log(type);

        if (type == 'fetch-game') {

            connections[payload.player.id] = ws;
            let gameId = payload.serverId || 'default';


            console.log('gameId', gameId);

            playerToFriendlyGame[payload.player.id] = gameId;

            if (typeof waitings[gameId] == "undefined" || waitings[gameId] == null) {
                console.log(' ---- new waiting player -----');
                waitings[gameId] = {
                    ws: ws,
                    player: payload.player,
                    opponentId: null,
                };
            } else {
                console.log(' ---- we alredy have waiting player -----');
                let msg = {
                    type: 'fetch-game-response',
                    payload: {
                        opponent: waitings[gameId].player,
                        playerInTurn: Math.random() > 0.5 ? waitings[gameId].player : payload.player,
                        gameId: uuid.v4()
                    }
                };

                opponents[payload.player.id] = waitings[gameId].player.id;
                opponents[waitings[gameId].player.id] = payload.player.id;

                ws.send(JSON.stringify(msg));

                msg.payload.opponent = payload.player;
                waitings[gameId].ws.send(JSON.stringify(msg));

                waitings[gameId] = null;
            }
        }

        if (type == 'new-move') {
            let opponentId = opponents[payload.move.player.id];
            if (typeof opponentId != "undefined")
                connections[opponentId].send(msg.data);
        }

        if (type == 'opponent-left') {
            let opponentId = opponents[payload.player.id];

            delete opponents[payload.player.id];
            delete connections[payload.player.id];

            if (typeof opponentId != "undefined" && typeof connections[opponentId] !== "undefined") {
                connections[opponentId].send(JSON.stringify({type: 'opponent-left', payload: {}}));
            }

            // default multiplaer
            if (waitings['default'] != null && waitings['default'].player.id == payload.player.id) {
                waitings['default'] = null;
            }

            // friendly games
            let gameId = playerToFriendlyGame[payload.player.id];
            if (waitings[gameId] != null && waitings[gameId].player.id == payload.player.id) {
                waitings[gameId] = null;
            }
        }
    };

    ws.onclose = (e) => {
        console.log(e);
    };

    ws.onerror = (e) => {
        console.log(e);
    };
});
