interface ISinglePlayerProps extends IScreenProps {
    playerToSignMapping: IReduxStatePlayerToSign;
    game: IReduxStateGame;
    user: IReduxStateUser;
    mappedMoves: {[key: number]: {[key: number]: TileSign}};
    changeSigns: () => any;
    initGame: (me: IPlayer, opponent: IPlayer) => any;
    makeMove: (move: IMove) => any;
    dispatch: IDispatch<IReduxState>;
}

interface ISinglePlayerState {
    showLoader: boolean;
}

interface ISinglePlayerRoute extends IRoute {
}
