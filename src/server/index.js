import {constants} from '../config';
import {Server} from 'ws';

let server = new Server({port: WS_PORT});

let players = {};
let waitingPlayer = null;

server.on('connection', function (ws) {