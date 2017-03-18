///<reference path="Home.d.tsx"/>
import React       from 'react';
import ReactNative from 'react-native';
import {connect}   from "react-redux";

const {StyleSheet} = ReactNative;
const {View} = ReactNative;
const {Text} = ReactNative;
const {NetInfo} = ReactNative;

import {updateInternet} from '../../actions/net';

import SnackBar from 'react-native-android-snackbar';
const Icon = require("react-native-vector-icons/FontAwesome").default;

import {Button} from'../../components/button';
import {baseStyle} from '../../theme';

import {route as singleplayerRoute} from '../singleplayer';
import {route as multiplayerRoute} from '../multiplayer';
import {route as friendlyMatchRoute} from '../friendly-match';
import {route as settingsRoute} from '../settings';
import {INTERNET_STATUS} from "../../actions/net";

class Home extends React.Component<IHomeProps, IHomeState> {

    private onMultiPlayerPress = (): void => {
        this.checkConnectionAndName()
            .then(() => this.props.navigator.push(multiplayerRoute))
            .catch(e => null);
    };

    private onFriendlyGamePress() {
        this.checkConnectionAndName()
            .then(() => this.props.navigator.push(friendlyMatchRoute))
            .catch(e => null);
    }

    private checkConnectionAndName = (): Promise<any> => {
        return new Promise((resolve, reject) => {

            if (this.props.user.nick == "") {
                this.showSnackbarEmptyName();
                reject('');
            } else if (this.props.net.status !== INTERNET_STATUS.ONLINE) {

                NetInfo.isConnected.fetch().then(isConnected => {
                    this.props.dispatch(updateInternet(isConnected ? INTERNET_STATUS.ONLINE : INTERNET_STATUS.OFFLINE));
                    if (isConnected) {
                        resolve('')
                    } else {
                        this.showSnackbarInternet();
                        reject('');
                    }
                });
            } else {
                resolve('');
            }

        })
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

        return <View style={[baseStyle.containerCenterHorizontal, {paddingHorizontal: 30}]}>

            <Button
                onPress={() => navigator.push(singleplayerRoute)}
                style={style.customButton}
                innerStyle={{alignItems: 'center'}}
            >
                <Text style={baseStyle.text}>Singleplayer</Text>
            </Button>

            <Button
                onPress={() => this.onMultiPlayerPress()}
                style={style.customButton}
                innerStyle={style.innerStyle}
            >
                <Text style={baseStyle.text}>Multiplayer</Text>
            </Button>

            <Button
                border={0}
                onPress={() => navigator.push(settingsRoute)}
                innerStyle={style.innerStyle}
                style={{marginVertical: 10}}
            >
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
    innerStyle: {
        alignItems: 'center'
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
