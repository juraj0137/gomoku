interface IReduxStatePlayerToSign  {
    readonly circle: IPlayer;
    readonly cross: IPlayer;
}

interface IPlayerToSignMapping extends IReduxStatePlayerToSign {
}