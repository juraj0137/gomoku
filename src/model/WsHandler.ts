import Store = Redux.Store;
import {constants} from '../config';
import {updateWebsocket, WEBSOCKET_STATUS, CHANGE_WS_STATUS} from "../actions/websocket";
import setPrototypeOf = Reflect.setPrototypeOf;
import {makeMove, changeGameStatus} from "../actions/game";

type FETCHED_GAME = {
    opponent: IPlayer,
    playerInTurn: IPlayer,
    gameId: string
}

export class WsHandler {

    private static store: Store<IReduxState>;
    private static connection: WebSocket = null;

    public static injectStore(store: Store<IReduxState>) {
        WsHandler.store = store;
    }

    static connect() {
        return new Promise((resolve, reject) => {
            if (this.connection !== null && this.connection.readyState == WebSocket.OPEN) {
                return resolve();
            }

            this.connection = new WebSocket(`ws://${constants.WS_ADDRESS}:${constants.WS_PORT}`);

            this.connection.onmessage = this.onMessageReceive;

            this.connection.onerror = (e) => {
                WsHandler.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.OFFLINE));
                this.connection = null;
                console.warn(`wshandler onerror -> ${e.filename}:${e.lineno} -> ${e.message}`);
                return reject('error');
            };

            this.connection.onclose = (e) => {
                WsHandler.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.OFFLINE));
                console.warn(`wshandler onclose -> code:${e.code}, reason:${e.reason}`);
                return reject('close');
            };

            this.connection.onopen = () => {
                WsHandler.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.ONLINE));
                return resolve();
            };
        });
    }

    static onMessageReceive(msg: any) {
        try {
            let {type, payload} = JSON.parse(msg.data);
            console.warn('received msg', type);

            if (type === 'new-move') {
                console.log(payload);
                let move = payload.move as IMove;
                WsHandler.store.dispatch(makeMove(move.row, move.column, WsHandler.store.getState().game.opponent));
            }

            if (type === "opponent-left") {
                WsHandler.store.dispatch(changeGameStatus(constants.GAME_OPPONENT_LEFT));
            }

        } catch (e) {
            console.error(`wshandler onMessageReceive -> ${e.message} -> json: ${msg.data}`);
        }
    }

    static fetchGame(player: IPlayer, serverId: string = ''): Promise<FETCHED_GAME> {
        return new Promise((resolve, reject) => {

            this.send('fetch-game', {player, serverId});

            this.connection.addEventListener('message', (msg: MessageEvent) => {
                try {
                    let {type, payload} = JSON.parse(msg.data);
                    if (type === 'fetch-game-response') {
                        const opponent = payload.opponent as IPlayer;
                        const game: FETCHED_GAME = {
                            opponent: opponent,
                            playerInTurn: payload.playerInTurn.id == player.id ? player : opponent,
                            gameId: payload.gameId
                        };
                        resolve(game);
                    }
                } catch (e) {
                    console.error(`wshandler fetchGame -> ${e.message}`);
                }
            });

        })
    }

    static playerLeft(player: IPlayer) {
        this.send('opponent-left', {player});
    }

    static sendMove(move: IMove) {
        this.send('new-move', {move})
    }

    private static send(type: string, payload: any) {
        this.connection.send(JSON.stringify({type, payload}));
    }
}
