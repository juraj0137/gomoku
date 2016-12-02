interface IReduxStateGame {
    readonly id: string;
    readonly status: string;
    readonly moves: ReadonlyArray<IMove>;
    readonly me: IPlayer;
    readonly opponent: IPlayer;
    readonly playerInTurn: IPlayer;
    readonly winner: IPlayer;
}

interface IPlayer {
    readonly id: string;
    readonly nick: string;
}

interface IMove {
    readonly player: IPlayer;
    readonly row: number;
    readonly column: number;
}

interface IGame extends IReduxStateGame {

}
