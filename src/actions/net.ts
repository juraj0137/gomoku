import {NetInfo} from 'react-native';
import Store = Redux.Store;

export enum INTERNET_STATUS {
    ONLINE,
    OFFLINE
}

export const CHANGE_INTERNET_STATUS = 'CHANGE_INTERNET_STATUS';
export type CHANGE_STATUS = {status: INTERNET_STATUS};

export const updateInternet: IActionCreator<IGenericAction<CHANGE_STATUS>> = (status: INTERNET_STATUS) => ({
    type: CHANGE_INTERNET_STATUS,
    payload: {status}
});

export function initNetwork(store: Store<IReduxState>) {

    function handleConnectivityChange(status: boolean) {
        store.dispatch(updateInternet(status ? INTERNET_STATUS.ONLINE : INTERNET_STATUS.OFFLINE));
    }

    NetInfo.isConnected.addEventListener(
        'change',
        handleConnectivityChange
    );
}