///<reference path="SinglePlayer.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';
import { connect } from "react-redux";
import { Bot } from "../../model/Bot";
import { Board } from '../../components/board';
import { ScoreBar } from '../../components/score-bar';
import { baseStyle } from '../../theme';
import { constants } from '../../config';
import { LoadingPage } from '../loading-page';
import { AfterGameModal } from '../../components/after-game-modal';
import * as fromGame from '../../actions/game';
import * as fromReducer from '../../reducers';
import { route as afterGameRoute } from '../after-game';
import { winnerSequenceSubject } from "../../reducers/game";
// import { winnerSequenceSubject } from "../../reducers/game";

const { View } = ReactNative;
const { InteractionManager } = ReactNative;

class SinglePlayer extends React.Component<ISinglePlayerProps, ISinglePlayerState> {

    private me: IPlayer;
    private opponent: IPlayer;
    private bot: Bot;
    private board: Board;

    constructor(props: ISinglePlayerProps) {
        super(props);

        this.state = {
            showLoader: true,
        };
    }

    componentWillMount(): void {
        this.me = {
            id: '123', //todo,
            nick: this.props.user.nick || 'You'
        };

        this.opponent = {
            id: '3212', //todo,
            nick: 'Bot',
        };

        this.bot = new Bot(this.opponent);

        this.props.initGame(this.me, this.opponent);
    }

    protected componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ showLoader: false });
        });
    }

    componentWillUnmount(): void {
        this.props.dispatch(fromGame.resetGame());
    }

    showAfterGameScreen = (): void => {

        const gameStatus = this.props.game.status;
        let status = '';
        let onNewGame = () => this.props.initGame(this.me, this.opponent);

        if (gameStatus == constants.GAME_WINNER) {
            status = this.props.game.winner == this.me ? 'win' : 'loss';
        } else if (gameStatus == constants.GAME_TIE) {
            status = 'tie';
        }

        if (status != '') {
            this.props.navigator.push(Object.assign({}, afterGameRoute, { status, onNewGame }))
        }
    };

    private botMoveIfCan = (responseCode: string) => {

        if (responseCode !== fromGame.MAKE_MOVE_NORMAL) {
            return;
        }

        setTimeout(() => {
            this.props
                .makeMove(this.bot.getNextMove(this.props.game.moves))
                .then(this.afterMove)
                .catch(console.log);
        }, 200);

    };

    private afterMove = (responseCode: string) => {

        if (responseCode == fromGame.MAKE_MOVE_GAME_END) {
            // make amazing animation in the end of game
            winnerSequenceSubject.take(1).subscribe(winnerSequence => {
                this.board.highlightSequence(winnerSequence)
                    .then(() => this.showAfterGameScreen());
            })
        }

        return responseCode;
    };

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
            .then(this.botMoveIfCan)
            .catch(console.log);
    };

    render() {

        if (this.state.showLoader)
            return <LoadingPage text="Preparing game" />;

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
    mappedMoves: fromReducer.getMappedMoves(state),
});

const mapDispatchToProps = (dispatch: IDispatch<IReduxState>) => ({
    changeSigns: () => dispatch(fromGame.changeSigns()),
    initGame: (me: IPlayer, opponent: IPlayer) => dispatch(fromGame.initGame(me, opponent, me)),
    makeMove: (m: IMove) => dispatch(fromGame.makeMove(m.row, m.column, m.player)),
    dispatch
});

export const route = {
    id: 'singleplayer',
    component: connect(mapStateToProps, mapDispatchToProps)(SinglePlayer)
};
