///<reference path="MultiPlayer.d.tsx"/>
import React            from 'react';
import ReactNative      from 'react-native';
import {connect}        from "react-redux";
import {Board}          from '../../components/board';
import SnackBar         from 'react-native-android-snackbar';
import {ScoreBar}       from '../../components/score-bar';
import {baseStyle}      from '../../theme';
import {constants}      from '../../config';
import {LoadingPage}    from '../loading-page';
import * as fromGame    from '../../actions/game';
import * as fromReducer from '../../reducers';
import {INTERNET_STATUS} from "../../actions/net";
import {Firebase} from "../../model/Firebase";
import {resetGame} from "../../actions/game";
import { route as afterGameRoute } from '../after-game';
import { winnerSequenceSubject } from "../../reducers/game";

import AppStateStatus = __React.AppStateStatus;

const uuid = require('node-uuid');

const {View}               = ReactNative;
const {AppState}           = ReactNative;
const {InteractionManager} = ReactNative;

class MultiPlayer extends React.Component<IMultiPlayerProps, IMultiPlayerState> {

    private me: IPlayer;
    private opponent: IPlayer;
    private serverId: string;
    private repeatedGame: boolean = false;
    private board: Board;

    constructor(props: IMultiPlayerProps) {
        super(props);
        this.state = {showLoader: true};
    }

    componentWillMount(): void {
        this.me = {
            id: uuid.v4(),
            nick: this.props.user.nick || 'You'
        };

        this.serverId = this.props.route['serverId'] || null;

        if (this.props.net.status == INTERNET_STATUS.ONLINE)
            this.findGame();
    }

    componentWillReceiveProps(nextProps: IMultiPlayerProps): void {

        const prevNet = this.props.net.status;
        const nextNet = nextProps.net.status;

        // --> offline
        if (prevNet == INTERNET_STATUS.ONLINE && nextNet == INTERNET_STATUS.OFFLINE) {
            this.showLongSnackbar("Internet connection lost.");
        }

        // --> online
        if (prevNet == INTERNET_STATUS.OFFLINE && nextNet == INTERNET_STATUS.ONLINE) {
            this.findGame();
        }
    }

    protected componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({showLoader: false});
        });
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this.handleAppStateChange);
        Firebase.playerLeft(this.me);
        this.props.dispatch(fromGame.resetGame());
    }

    private handleAppStateChange = (state: AppStateStatus) => {
        if (state == 'background') {
            this.props.navigator.popToTop();
            Firebase.playerLeft(this.me);
            AppState.removeEventListener('change', this.handleAppStateChange);
        }
    };

    findGame = (checkGameStatus: boolean = true): void => {
        if (checkGameStatus && this.props.game.status !== constants.GAME_CANCELED) {
            return;
        }

        Firebase.fetchGame(this.me, this.serverId).then(config => {
            this.opponent = config.opponent;
            this.props.initGame(this.me, this.opponent, config.playerInTurn, config.gameId);

            // opponent moves
            Firebase.onNewMove().subscribe((move) => {
                this.props
                    .makeMove(move)
                    .then(this.afterMove)
                    .catch(console.warn);
            })
        }).catch(e => console.warn(e.message));
    };

    private showLongSnackbar(text: string) {
        SnackBar.show(text, {duration: SnackBar.LONG});
    }

    private onTileTouch = (row: number, column: number) => {
        if (this.props.game.playerInTurn != this.me)
            return;

        const move: IMove = {
            row, column,
            player: this.me
        };

        this.props
            .makeMove(move)
            .then(this.afterMove)
            .catch(console.warn);
    };

    private onNewGameClick = () => {
        this.repeatedGame = true;
        this.props.dispatch(resetGame());
        this.findGame(false);
    };


    showAfterGameScreen = (): void => {

        let status = '';
        let onNewGame = () => this.onNewGameClick();

        const gameStatus = this.props.game.status;
        if (gameStatus == constants.GAME_WINNER) {
            status = this.props.game.winner == this.me ? 'win' : 'loss';
        } else if (gameStatus == constants.GAME_TIE) {
            status = 'tie';
        }

        if(status != '')
            this.props.navigator.push(Object.assign({}, afterGameRoute, {status, onNewGame}))
    };


    private afterMove = (responseCode: string) => {

        if(responseCode == fromGame.MAKE_MOVE_GAME_END){
            // make amazing animation in the end of game
            winnerSequenceSubject.take(1).subscribe(winnerSequence => {
                this.board.highlightSequence(winnerSequence)
                    .then(() => this.showAfterGameScreen());
            })
            this.showAfterGameScreen();
        }

        return responseCode;
    };

    render() {

        if (this.state.showLoader)
            return <LoadingPage text=""/>;

        if (this.props.net.status !== INTERNET_STATUS.ONLINE)
            return <LoadingPage text="Connecting"/>;

        const serverCode = !this.repeatedGame && this.serverId != null ? this.serverId : null;
        if (this.props.game.status == constants.GAME_CANCELED)
            return <LoadingPage text="Waiting for opponent" serverCode={serverCode}/>;

        const moves = this.props.game.moves;
        const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;

        return <View style={baseStyle.container}>
            <ScoreBar
                me={this.props.game.me}
                opponent={this.props.game.opponent}
                playerInTurn={this.props.game.playerInTurn}
                playerToSignMapping={this.props.playerToSignMapping}
                onSingChangeClick={this.props.changeSigns}
            />
            <Board
                lastMove={lastMove}
                mappedMoves={this.props.mappedMoves}
                onTouch={this.onTileTouch}
                ref={board => this.board = board}
            />

        </View>;
    }
}

const mapStateToProps = (state: IReduxState) => ({
    playerToSignMapping: state.playerToSignMapping,
    game: state.game,
    user: state.user,
    net: state.net,
    mappedMoves: fromReducer.getMappedMoves(state),
});

const mapDispatchToProps = (dispatch: IDispatch<IReduxState>) => ({
    changeSigns: () => dispatch(fromGame.changeSigns()),
    initGame: (me: IPlayer, opponent: IPlayer, playerInTurn: IPlayer, gameId: string) =>
        dispatch(fromGame.initGame(me, opponent, playerInTurn, gameId)),
    makeMove: (m: IMove) => dispatch(fromGame.makeMove(m.row, m.column, m.player)),
    dispatch
});

export const route = {
    id: 'multiplayer',
    component: connect(mapStateToProps, mapDispatchToProps)(MultiPlayer)
};
