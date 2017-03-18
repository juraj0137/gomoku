import React, {Component}  from 'react';
import {Provider}          from "react-redux";
import {constants}         from './config';
import {Navigator}         from "./components/navigator";
import configureStore      from "./store/configureStore";
import {AdMobInterstitial} from 'react-native-admob';

const KeepAwake = require('react-native-keep-awake').default;

const store = configureStore();

AdMobInterstitial.setAdUnitID(constants.AD_ID_AFTER_GAME);

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
