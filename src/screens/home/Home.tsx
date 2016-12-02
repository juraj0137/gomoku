///<reference path="Home.d.tsx"/>
import React       from 'react';
import ReactNative from 'react-native';
import {connect}   from "react-redux";

const {StyleSheet} = ReactNative;
const {View} = ReactNative;
const {Text} = ReactNative;

import SnackBar from 'react-native-android-snackbar';
const Icon = require("react-native-vector-icons/FontAwesome").default;

import {Button} from'../../components/button';
import {baseStyle} from '../../theme';
import TextStyle = __React.TextStyle;


import {route as singleplayerRoute} from '../singleplayer';
import {route as multiplayerRoute} from '../multiplayer';
// import {route as friendlyMatchRoute} from './FriendlyMatchSetup'; todo
import {route as settingsRoute} from '../settings';
import {INTERNET_STATUS} from "../../actions/net";

const friendlyMatchRoute = {};

class Home extends React.Component<IHomeProps, IHomeState> {

    private onMultiPlayerPress = (): void => {
        if (this.props.user.nick == "") {
            this.showSnackbarEmptyName();
            return;
        }

        // connection required
        if (this.props.net.status !== INTERNET_STATUS.ONLINE) {
            this.showSnackbarInternet();
            return;
        }

        this.props.navigator.push(multiplayerRoute);
    };

    showSnackbarEmptyName() {
        SnackBar.show('At first, you must enter your name.', {
            actionLabel: 'Settings',
            actionCallback: () => this.props.navigator.push(settingsRoute),
            duration: SnackBar.LONG,
        });
    }

    showSnackbarInternet() {
        SnackBar.show("You don't have internet connection.", {
            duration: SnackBar.LONG,
        });
    }

    render() {

        let navigator = this.props.navigator;

        return <View style={[baseStyle.containerCenterHorizontal, {paddingHorizontal: 20}]}>

            <Button onPress={() => this.onMultiPlayerPress()} style={style.customButton}>
                <Text style={baseStyle.text}>Multiplayer</Text>
            </Button>

            <Button onPress={() => navigator.push(singleplayerRoute)} style={style.customButton}>
                <Text style={baseStyle.text}>Singleplayer</Text>
            </Button>

            <Button onPress={() => navigator.push(friendlyMatchRoute)} style={style.customButton}>
                <Text style={baseStyle.text}>Friendly match</Text>
            </Button>

            <Button border={0} onPress={() => navigator.push(settingsRoute)}>
                <Icon name="gear" size={30}/>
                <Text style={[baseStyle.text, style.settingsText]}>Settings</Text>
            </Button>
        </View>;
    }
}

const mapStateToProps = (state: IReduxState) => ({
    user: state.user,
    net: state.net
});

export const route: IHomeRoute = {
    id: 'home',
    component: connect(mapStateToProps)(Home),
};

const style = StyleSheet.create({
    customButton: {
        minWidth: 200,
        marginVertical: 25,
    } as ViewStyle,
    notice: {
        marginTop: -32,
        height: 32,
        color: 'red',
        textAlign: 'center',
    } as TextStyle,
    settingsText: {
        marginLeft: 10,
    } as TextStyle
});
