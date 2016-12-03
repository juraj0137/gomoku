import ReactNative from 'react-native';
import {UPDATE_USER, updateUserData} from '../actions/user'
import Store = Redux.Store;
import setPrototypeOf = Reflect.setPrototypeOf;

const {AsyncStorage} = ReactNative;

export function initLocalStorage(store: Store<IReduxState>): void {

    AsyncStorage.getItem('user-data')
        .then((str: string) => {
            let user = JSON.parse(str);

            if (user != null)
                store.dispatch(updateUserData(user));
        })
        .catch(e =>
            console.warn(e.message)
        );

    store.subscribe(() => {

        const state = store.getState();

        if ([UPDATE_USER].indexOf(state.lastAction.type.toString()) > -1) {
            AsyncStorage
                .mergeItem('user-data', JSON.stringify(state.user))
                .catch(e => console.warn(e.message));
        }
    });
}
