import Store = Redux.Store;
import {constants} from '../config';
import {updateWebsocket, WEBSOCKET_STATUS} from "../actions/websocket";
import setPrototypeOf = Reflect.setPrototypeOf;

type FETCHED_GAME = {
    opponent: IPlayer,
    playerInTurn: IPlayer,
    gameId: string
}

export class WsHandler {

    private static store: Store<IReduxState>;
    private static connection: WebSocket = null;

    public static injectStore(store: Store<IReduxState>) {
        this.store = store;
    }

    static connect() {
        return new Promise((resolve, reject) => {
            if (this.connection != null) {
                return resolve();
            }

            this.connection = new WebSocket(`ws://${constants.WS_ADDRESS}:${constants.WS_PORT}`);

            this.connection.onmessage = this.onMessageReceive;

            this.connection.addEventListener('message', (msg: MessageEvent) => {
                console.log('listener', msg);
            });

            this.connection.onerror = (e) => {
                this.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.OFFLINE));
                this.connection = null;
                console.warn(e.message);
                return reject('error');
            };

            this.connection.onclose = (e) => {
                this.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.OFFLINE));
                console.warn(e.code, e.reason);
                return reject('close');
            };

            this.connection.onopen = () => {
                this.store.dispatch(updateWebsocket(WEBSOCKET_STATUS.ONLINE));
                return resolve();
            };
        });
    }

    static onMessageReceive(msg: any) {
        console.log('setter', msg);
    }

    static fetchGame(): Promise<FETCHED_GAME> {
        return new Promise((resolve, reject) => {

        })
    }

    static playerLeft(player: IPlayer) {

    }

    static sendMove(move: IMove) {

    }
}
