import Store = Redux.Store;

export enum WEBSOCKET_STATUS {
    ONLINE,
    OFFLINE
}

export enum ACTION_TYPES {
    CHANGE_WS_STATUS,
}

export type CHANGE_STATUS = {status: WEBSOCKET_STATUS};

export const updateWebsocket: IActionCreator<IGenericAction<CHANGE_STATUS>> = (status: WEBSOCKET_STATUS) => ({
    type: ACTION_TYPES.CHANGE_WS_STATUS,
    payload: {status}
});
