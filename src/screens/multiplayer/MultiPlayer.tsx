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
import {AfterGameModal} from '../../components/after-game-modal';
import * as fromGame    from '../../actions/game';
import * as fromReducer from '../../reducers';
import {INTERNET_STATUS} from "../../actions/net";
import {WEBSOCKET_STATUS} from "../../actions/websocket";
import {WsHandler} from "../../model/WsHandler";
import {resetGame} from "../../actions/game";
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

    constructor(props: IMultiPlayerProps) {
        super(props);
        this.state = {showLoader: true};
    }

    componentWillMount(): void {
        this.me = {
            id: uuid.v4(),
            nick: this.props.user.nick || 'You'
        };

        if (this.props.net.status == INTERNET_STATUS.ONLINE)
            WsHandler.connect().then(this.findGame).catch(console.warn);

        this.serverId = this.props.route['serverId'] || null;
    }

    componentWillReceiveProps(nextProps: IMultiPlayerProps): void {

        const prevNet = this.props.net.status;
        const nextNet = nextProps.net.status;

        const prevWS = this.props.websocket.status;
        const nextWS = nextProps.websocket.status;
        let timer: number = 0;

        // --> offline
        if (prevNet == INTERNET_STATUS.ONLINE && nextNet == INTERNET_STATUS.OFFLINE) {
            this.showLongSnackbar("Internet connection lost.");
        }

        // --> online
        if (prevNet == INTERNET_STATUS.OFFLINE && nextNet == INTERNET_STATUS.ONLINE) {
            WsHandler.connect().then(this.findGame).catch(console.warn);
        }

        // --> ws lost
        if (prevWS == WEBSOCKET_STATUS.ONLINE && nextWS == WEBSOCKET_STATUS.OFFLINE) {
            this.showLongSnackbar("Server connection problem.");
            setInterval(() => {
                WsHandler.connect().then(() => this.findGame()).catch(console.warn);
            }, 3000);
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
        WsHandler.playerLeft(this.me);
        this.props.dispatch(fromGame.resetGame());
    }

    private handleAppStateChange = (state: AppStateStatus) => {
        if (state == 'background') {
            this.props.navigator.popToTop();
            WsHandler.playerLeft(this.me);
            AppState.removeEventListener('change', this.handleAppStateChange);
        }
    };

    private findGame = (checkGameStatus: boolean = true): void => {
        if (checkGameStatus && this.props.game.status !== constants.GAME_CANCELED) {
            return;
        }

        WsHandler.fetchGame(this.me, this.serverId).then(config => {
            this.opponent = config.opponent;
            this.props.initGame(this.me, this.opponent, config.playerInTurn, config.gameId);
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
            .then(() => WsHandler.sendMove(move))
            .catch(console.warn);
    };

    private goToMenu = () => this.props.navigator.popToTop();

    private onNewGameClick = () => {
        this.repeatedGame = true;
        this.props.dispatch(resetGame());
        this.findGame(false);
    };

    private getAfterGameModalType = () => {
        const gameStatus = this.props.game.status;
        let result = '';
        if (gameStatus == constants.GAME_WINNER) {
            result = this.props.game.winner == this.me ? 'win' : 'loss';
        } else if (gameStatus == constants.GAME_TIE) {
            result = 'tie';
        } else if (gameStatus == constants.GAME_OPPONENT_LEFT) {
            result = 'opponent-left';
        }
        return result as "opponent-left" | "win" | "loss" | "tie" | "";
    };

    render() {

        if (this.state.showLoader)
            return <LoadingPage text=""/>;

        if (this.props.net.status !== INTERNET_STATUS.ONLINE || this.props.websocket.status !== WEBSOCKET_STATUS.ONLINE)
            return <LoadingPage text="Connecting"/>;

        const serverCode = !this.repeatedGame && this.serverId != null ? this.serverId : null;
        if (this.props.game.status == constants.GAME_CANCELED)
            return <LoadingPage text="Looking for opponnent" serverCode={serverCode}/>;

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
            />
            <AfterGameModal
                type={this.getAfterGameModalType()}
                onNewGameClick={this.onNewGameClick}
                onGoToMenuClick={this.goToMenu}
            />

        </View>;
    }
}

const mapStateToProps = (state: IReduxState) => ({
    playerToSignMapping: state.playerToSignMapping,
    game: state.game,
    user: state.user,
    net: state.net,
    websocket: state.websocket,
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
