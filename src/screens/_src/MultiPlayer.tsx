// import React from 'react';
//
// // import Board from '../components/Board'
// // import Game from '../model/Game';
// // import Player from '../model/Player';
// // import PlayerPhone from '../model/PlayerPhone';
// // import {WsHandler, WsMessage} from '../model/WsHandler';
// // import LoadingPage from '../screens/LoadingPage';
// // import * as baseStyle from '../theme/baseStyle';
// // import AfterGameModal from '../components/AfterGameModal'
// //
// // import {
// //     View,
// //     InteractionManager,
// //     NetInfo,
// // } from 'react-native';
// //
// // import {
// //     INTERNET_CONNECTED,
// //     INTERNET_DISCONNECTED,
// //     INTERNET_CHECKING,
// //     WS_CLOSED,
// //     WS_OPEN,
// //     SENDER_CLIENT,
// //     WS_TYPE_LOOKING_FOR_GAME,
// //     WS_TYPE_INIT_GAME,
// //     WS_TYPE_NEW_MOVE,
// //     GAME_LIVE,
// //     GAME_TIE,
// //     GAME_WINNER,
// // } from '../model/constants'
//
// interface IMultiPlayerProps {
//     playerToSignMapping: IReduxStatePlayerToSign;
//     game: IReduxStateGame;
//     user: IReduxStateUser;
//     mappedMoves: {[key: number]: {[key: number]: TileSign}};
//     changeSigns: () => any;
//     initGame: (me: IPlayer, opponent: IPlayer) => any;
//     makeMove: (move: IMove) => any;
// }
//
// interface IMultiPlayerState {
//     showLoader: boolean;
// }
//
// class MultiPlayer extends React.Component<any, any> {
//
//     // constructor() {
//     //     super(...arguments);
//     //
//     //     this.state = {
//     //         internet: INTERNET_DISCONNECTED,
//     //         ws: WS_CLOSED,
//     //         board: null,
//     //         gameStatus: null,
//     //         showLoader: true,
//     //         mySign: 'circle',
//     //     };
//     // }
//     //
//     // componentDidMount() {
//     //
//     //     this.me = new PlayerPhone().setName(this.props.user.nick);
//     //     this.ws = new WsHandler();
//     //
//     //     InteractionManager.runAfterInteractions(() => {
//     //         this.setState({showLoader: false});
//     //     });
//     //
//     //     /*
//     //      * bind websocket listeners
//     //      */
//     //     this.ws.onMessage(this._onWsReceiveMessage);
//     //     this.ws.onChangeReadyStatus((ws, status) => {
//     //         if (this.isUnmounting == true) return;
//     //
//     //         // websocket connection status has been changed
//     //         this.setState({ws: status});
//     //
//     //         // look for game if have connection
//     //         if (status == WS_OPEN) this._lookForGame();
//     //     });
//     //
//     //     /*
//     //      * handle internet connection
//     //      */
//     //     this.setState({internet: INTERNET_CHECKING});
//     //     NetInfo.isConnected.fetch().then(this._updateInternetStatus);
//     //     NetInfo.isConnected.addEventListener('change', this._updateInternetStatus);
//     //
//     // }
//     //
//     // componentWillUnmount() {
//     //
//     //     this.isUnmounting = true;
//     //
//     //     NetInfo.isConnected.removeEventListener('change', this._updateInternetStatus);
//     //     this.ws.closeConnection();
//     // }
//     //
//     // _onWsReceiveMessage = (msg) => {
//     //     // console.warn(msg.toJson());
//     //     switch (msg.getType()) {
//     //         case WS_TYPE_INIT_GAME:
//     //             this.game = this._initGame(msg);
//     //             this._updateGameState(msg);
//     //             break;
//     //         case WS_TYPE_NEW_MOVE:
//     //             this._opponentMadeMove(msg);
//     //             this._updateGameState(msg);
//     //             break;
//     //     }
//     // };
//     //
//     // _opponentMadeMove = (msg) => {
//     //
//     //     let {row, column, playerId} = msg.getData();
//     //
//     //     if (this.opponent.getId() == playerId) {
//     //         this.opponent
//     //             .makeMove(row, column)
//     //             .then(this._updateGame)
//     //             .catch(error => console.warn(error));
//     //     }
//     // };
//     //
//     // _updateGameState = (msg) => {
//     //
//     //     if (!(this.game instanceof Game))
//     //         console.warn('game doesnt exist');
//     //
//     //     this.setState({
//     //         board: this.game.getGameBoard(),
//     //         gameStatus: this.game.getGameStatus(),
//     //     })
//     // };
//     //
//     // _lookForGame = () => {
//     //     this.me.setGame(null);
//     //     this.setState({board: null})
//     //     this.ws.send(new WsMessage(WS_TYPE_LOOKING_FOR_GAME, {player: this.me}, SENDER_CLIENT));
//     // };
//     //
//     // _updateInternetStatus = (isConnected) => {
//     //
//     //     let status = isConnected ? INTERNET_CONNECTED : INTERNET_DISCONNECTED;
//     //
//     //     if (this.state.internet != status) {
//     //         this.setState({internet: status});
//     //
//     //         if (status == INTERNET_CONNECTED)
//     //             this.ws.connect();
//     //
//     //         if (status == INTERNET_DISCONNECTED)
//     //             this.ws.closeConnection();
//     //     }
//     // };
//     //
//     // _sendLastMove = (game) => {
//     //
//     //     let lastMove = game.getMoves();
//     //
//     //     lastMove = lastMove[lastMove.length - 1];
//     //
//     //     this.ws.send(new WsMessage(
//     //         WS_TYPE_NEW_MOVE,
//     //         {lastMove: {row: lastMove.row, column: lastMove.column, playerId: lastMove.player.getId()}},
//     //         SENDER_CLIENT
//     //     ));
//     // };
//     //
//     // _initGame = (msg) => {
//     //
//     //     let {playerA, playerB, playerInTurn, sameInRow, rows, columns} = msg.getData();
//     //
//     //     playerA = JSON.parse(playerA);
//     //     playerB = JSON.parse(playerB);
//     //     playerInTurn = JSON.parse(playerInTurn);
//     //
//     //     let opponentId = playerA.id == this.me.getId() ? playerB.id : playerA.id;
//     //
//     //     this.opponent = new PlayerPhone().setId(opponentId);
//     //
//     //     playerA = playerA.id == this.me.getId() ? this.me : this.opponent;
//     //     playerB = playerB.id == this.me.getId() ? this.me : this.opponent;
//     //
//     //     playerInTurn = playerInTurn.id == this.me.getId() ? this.me : this.opponent;
//     //
//     //     let game = new Game({rows, columns, sameInRow, playerInTurn, playerA, playerB});
//     //
//     //     let changeGameStatusWithDelay = (status) => setTimeout(()=> {
//     //         this.setState({gameStatus: status});
//     //     }, 500);
//     //
//     //     game.onChangeGameStatus((/* Game */game) => {
//     //         if (game.getGameStatus() == GAME_TIE) {
//     //             changeGameStatusWithDelay(GAME_TIE);
//     //         } else if (game.getGameStatus() == GAME_WINNER) {
//     //             let status = this.me == game.getWinner() ? 'winner' : 'looser';
//     //             changeGameStatusWithDelay(status);
//     //         } else if (game.getGameStatus() == GAME_LIVE) {
//     //             this.setState({gameStatus: GAME_LIVE});
//     //         }
//     //     });
//     //
//     //     return game;
//     // };
//     //
//     // _changeSign = () => {
//     //
//     //     this.setState({mySign: this.state.mySign == 'circle' ? 'cross' : 'circle'})
//     // };
//     //
//     // _onTouch = (row, column) => {
//     //
//     //     if (this.game.getPlayerInTurn() != this.me) return;
//     //
//     //     this.me
//     //         .makeMove(row, column)
//     //         .then(this._updateGame)
//     //         .then(this._sendLastMove)
//     //         .catch(error => console.warn(error));
//     // };
//     //
//     // _updateGame = (game) => {
//     //
//     //     this.setState({board: game.getGameBoard()});
//     //     return new Promise((resolve, reject) => {
//     //         resolve(game);
//     //     })
//     // };
//     //
//     // _goToMenu = () => this.props.navigator.pop();
//
//     render() {
//
//         return null;
//
//         // let {mySign, board, showLoader, internet, ws} = this.state;
//         //
//         // if (internet != INTERNET_CONNECTED || ws != WS_OPEN)
//         //     return <LoadingPage text="Connecting"/>;
//         //
//         // if (board == null)
//         //     return <LoadingPage text="Looking for opponent"/>;
//         //
//         // if (showLoader)
//         //     return <LoadingPage />;
//         //
//         // return <View style={baseStyle.container}>
//         //
//         //     <ScoreBoard me={this.me}
//         //                 opponent={this.opponent}
//         //                 inTurn={this.game.getPlayerInTurn()}
//         //                 onChange={this._changeSign}
//         //                 mySign={mySign}/>
//         //
//         //     <Board board={board}
//         //            onTouch={this._onTouch}
//         //            game={this.game}
//         //            me={this.me}
//         //            opponent={this.opponent}
//         //            mySign={mySign}/>
//         //
//         //     <AfterGameModal onNewGamePress={this._lookForGame}
//         //                     onGoBackPress={this._goToMenu}
//         //                     gameStatus={this.state.gameStatus}/>
//         //
//         // </View>
//     }
// }
//
// export const route = {
//     id: 'multiplayer',
//     component: MultiPlayer
// };
