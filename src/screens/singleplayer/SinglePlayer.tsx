///<reference path="SinglePlayer.d.tsx"/>
import React            from 'react';
import ReactNative      from 'react-native';
import {connect}        from "react-redux";
import {Bot}            from "../../model/Bot";
import {Board}          from '../../components/board';
import {ScoreBar}       from '../../components/score-bar';
import {baseStyle}      from '../../theme';
import {constants}      from '../../config';
import {LoadingPage}    from '../loading-page';
import {AfterGameModal} from '../../components/after-game-modal';
import * as fromGame    from '../../actions/game';
import * as fromReducer from '../../reducers';

const {View}               = ReactNative;
const {InteractionManager} = ReactNative;

class SinglePlayer extends React.Component<ISinglePlayerProps, ISinglePlayerState> {

    private me: IPlayer;
    private opponent: IPlayer;
    private bot: Bot;

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
            this.setState({showLoader: false});
        });
    }

    private botMoveIfCan = (responseCode: string) => {

        if (responseCode !== fromGame.MAKE_MOVE_NORMAL) {
            return;
        }

        setTimeout(() => {
            this.props
                .makeMove(this.bot.getNextMove(this.props.game.moves))
                .catch(console.log);
        }, 200);

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
            .then(this.botMoveIfCan)
            .catch(console.log);
    };

    private goToMenu = () => this.props.navigator.pop();

    private getAfterGameModalType = (): "win" | "loss" | "tie" | "" => {

        const gameStatus = this.props.game.status;

        if (gameStatus == constants.GAME_WINNER) {
            return this.props.game.winner == this.me ? 'win' : 'loss';
        } else if (gameStatus == constants.GAME_TIE) {
            return 'tie';
        }
        return '';
    };

    render() {

        if (this.state.showLoader)
            return <LoadingPage text="Preparing game"/>;

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
                onNewGameClick={() => this.props.initGame(this.me, this.opponent)}
                onGoToMenuClick={this.goToMenu}
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
});

export const route = {
    id: 'singleplayer',
    component: connect(mapStateToProps, mapDispatchToProps)(SinglePlayer)
};
