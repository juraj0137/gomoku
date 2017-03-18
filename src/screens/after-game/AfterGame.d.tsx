interface IAfterGameProps extends IScreenProps {
    route: IAfterGameRoute;
}

interface IAfterGameState {
}

interface IAfterGameRoute extends IRoute {
    status: string;
    onNewGame?: () => void;
}
