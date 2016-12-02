import thunk                          from 'redux-thunk'
import {reducer}                      from "../reducers/index";
import {initNetwork}                      from "../actions/net";
import promise                        from 'redux-promise'
import createLogger                   from 'redux-logger';
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

    initNetwork(store);
    WsHandler.injectStore(store);

    return store;
}
