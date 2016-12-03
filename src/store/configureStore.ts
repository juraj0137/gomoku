import thunk                          from 'redux-thunk'
import promise                        from 'redux-promise'
import {reducer}                      from "../reducers/index";
import createLogger                   from 'redux-logger';
import {initNetwork}                  from "../actions/net";
import {initLocalStorage}             from "./localStorage";
import {createStore, applyMiddleware} from "redux";

const logger = createLogger({
    collapsed: true
});

import Store = Redux.Store;
import {WsHandler} from "../model/WsHandler";

export default function (): Store<any> {
    const store = createStore(
        reducer,
        applyMiddleware(thunk, promise, logger)
    ) as Store<any>;

    initLocalStorage(store);
    initNetwork(store);
    WsHandler.injectStore(store);

    return store;
}
