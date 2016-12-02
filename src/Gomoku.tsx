import React, {Component} from 'react';
import {Provider}         from "react-redux";
import {Navigator}        from "./components/navigator";
import configureStore     from "./store/configureStore";

const KeepAwake = require('react-native-keep-awake').default;

const store = configureStore();

export class Gomoku extends Component<IGomokuProps, IGomokuState> {

    componentDidMount() {
        KeepAwake.activate();
    }

    render() {
        return <Provider store={store}>
            <Navigator />
        </Provider>;
    }
}
