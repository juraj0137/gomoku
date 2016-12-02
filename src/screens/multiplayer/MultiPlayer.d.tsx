interface IMultiPlayerProps extends IScreenProps {
    playerToSignMapping: IReduxStatePlayerToSign;
    game: IReduxStateGame;
    user: IReduxStateUser;
    net: IReduxStateNet;
    websocket: IReduxStateWebsocket;
    mappedMoves: {[key: number]: {[key: number]: TileSign}};

    changeSigns: () => any;
    initGame: (me: IPlayer, opponent: IPlayer, playerInTurn: IPlayer, gameId: string) => any;
    makeMove: (move: IMove) => any;
    dispatch: IDispatch<IReduxState>;
}

interface IMultiPlayerState {
    showLoader: boolean;
}

interface IMultiPlayerRoute extends IRoute {
}
