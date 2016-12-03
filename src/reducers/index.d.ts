import IAction = Redux.Action;
import IReducer = Redux.Reducer;
import IDispatch = Redux.Dispatch;
import IThunkAction = Redux.ThunkAction;
import IActionCreator = Redux.ActionCreator;

interface IReduxState {
    readonly lastAction: IGenericAction<any>;
    readonly user: IReduxStateUser;
    readonly game: IReduxStateGame;
    readonly playerToSignMapping: IReduxStatePlayerToSign;
    readonly net: IReduxStateNet;
    readonly websocket: IReduxStateWebsocket;
}

interface IGenericAction<T> extends IAction {
    readonly payload: T
}

