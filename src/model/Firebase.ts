import Store = Redux.Store;
import {constants} from '../config';
import setPrototypeOf = Reflect.setPrototypeOf;
import {makeMove, changeGameStatus} from "../actions/game";
import {Observable, Observer} from "rx-lite";

const uuid = require('node-uuid');

import * as firebase from 'firebase';

const db = firebase.initializeApp(constants.FIREBASE_CONFIG).database();
const dbGames = db.ref('games');
let game: firebase.database.Reference = null;
let player: IPlayer = null;

type FETCHED_GAME = {
    opponent: IPlayer,
    playerInTurn: IPlayer,
    gameId?: string
}

export class Firebase {

    static store: Store<IReduxState>;
    static onNewMoveObserver: Observer<IMove>;

    static bindEvents() {

        game.child('moves').on('child_added', (move) => {
            if (move.val().player.id == player.id) {
                return
            }

            let moveVal = move.val() as IMove;
            moveVal.player = Firebase.store.getState().game.opponent;
            Firebase.onNewMoveObserver.onNext(moveVal);
        });

        game.child('opponentLeft').on('value', (snapshot) => {

            if (snapshot.val() == null) {
                return;
            }

            Firebase.store.dispatch(changeGameStatus(constants.GAME_OPPONENT_LEFT));
            game.child('opponentLeft').off();
        });

        game.child('status').on('value', (snapshot) => {
            if (snapshot.val() == 'end') {

                game.child('moves').off();
                game.child('status').off();
            }
        })
    }

    static onNewMove(): Observable<IMove> {
        return Observable.create((observer: Observer<IMove>) => {
            Firebase.onNewMoveObserver = observer;
        })
    }

    static fetchGame(paPlayer: IPlayer, serverId: string = null): Promise<FETCHED_GAME> {
        return new Promise((resolve, reject) => {

            player = paPlayer;

            dbGames.once('value', games => {

                let opponent: Object = null;
                let playerInTurn: Object = null;

                const foundGame = games.forEach((g) => {

                    // try to find not started game
                    const notMe = g.child('playerA/id').val() != player.id || true;
                    const emptyOpponent = g.child('playerB').val() == null;
                    const notEnd = g.child('status').val() != 'end';
                    const friendlyServer = serverId != null ?
                        g.child('serverId').val() == serverId :
                        g.child('serverId').val() == null;

                    if (notMe && emptyOpponent && notEnd && friendlyServer) {

                        // we found not started game
                        game = dbGames.child(g.key);

                        opponent = g.child('playerA').val();
                        playerInTurn = Math.random() > 0.5 ? opponent : player;
                        dbGames.child(game.key).update({playerB: player, playerInTurn});

                        return true
                    }
                    return false;
                });

                if (foundGame) {
                    Firebase.bindEvents();
                    resolve({opponent, playerInTurn});
                } else {

                    // if there is no not started game, we start new one
                    game = dbGames.push({
                        playerA: player,
                        serverId: serverId
                    });

                    game.child('playerB').on('value', (o) => {
                        if (o.val() == null) {
                            return;
                        }

                        game.once('value', (snapshot) => {
                            const opponent = snapshot.child('playerB').val();
                            const playerInTurnId = snapshot.child('playerInTurn').val().id;
                            const playerInTurn = player.id == playerInTurnId ? player : opponent;

                            Firebase.bindEvents();

                            resolve({opponent, playerInTurn});

                            game.child('playerB').off();
                        });
                    });
                }
            });
        })
    }

    static playerLeft(player: IPlayer) {
        if(game) game.update({opponentLeft: player})
            .then(() => Firebase.endGame());
    }

    static sendMove(move: IMove) {
        if(game) game.child('moves').push(move);
    }

    static endGame() {
        if(game) game.update({status: 'end'});
    }
}
