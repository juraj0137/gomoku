import React, {Component} from 'react';
import {WsHandler, WsMessage} from '../model/WsHandler';
import * as baseStyle from '../theme/base';
import Button from '../components/Button';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    InteractionManager,
    NetInfo,
} from 'react-native';

import {
    INTERNET_CONNECTED,
    INTERNET_DISCONNECTED,
    INTERNET_CHECKING,
    WS_CLOSED,
    WS_OPEN,
    SENDER_CLIENT,
    WS_TYPE_LOOKING_FOR_GAME,
    WS_TYPE_INIT_GAME,
    WS_TYPE_NEW_MOVE,
    GAME_LIVE,
    GAME_TIE,
    GAME_WINNER,
} from '../model/constants'

export default class FriendlyMatchSetup extends Component {

    constructor() {
        super(...arguments);

        this.state = {
            internet: INTERNET_DISCONNECTED,
            ws: WS_CLOSED,
        };
    }


    /**
     *
     */
    componentDidMount() {

        this.ws = new WsHandler();

        /*
         * bind websocket listeners
         */
        this.ws.onMessage(this._onWsReceiveMessage);
        this.ws.onChangeReadyStatus((ws, status) => {
            // websocket connection status has been changed
            this.setState({ws: status});

        });

        /*
         * handle internet connection
         */
        this.setState({internet: INTERNET_CHECKING});
        NetInfo.isConnected.fetch().then(this._updateInternetStatus);
        NetInfo.isConnected.addEventListener('change', this._updateInternetStatus);

    }


    /**
     *
     */
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this._updateInternetStatus);
        this.ws.closeConnection();
    }


    /**
     *
     * @param {WsMessage} msg
     * @private
     */
    _onWsReceiveMessage = (msg) => {
    };


    /**
     *
     * @param isConnected
     * @private
     */
    _updateInternetStatus = (isConnected) => {

        let status = isConnected ? INTERNET_CONNECTED : INTERNET_DISCONNECTED;

        if (this.state.internet != status) {
            this.setState({internet: status});

            if (status == INTERNET_CONNECTED)
                this.ws.connect();

            if (status == INTERNET_DISCONNECTED)
                this.ws.closeConnection();
        }
    };


    /**
     *
     * @private
     */
    _goToMenu = () => this.props.navigator.pop();


    /**
     *
     * @returns {XML}
     */
    render() {
        return <View style={baseStyle.container}>
            <Text style={[baseStyle.bigText, {textAlign: 'center'}]}>Friendly match</Text>
            <View style={[baseStyle.container, {justifyContent: 'space-around'}]}>
                <View style={{flex: 1, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: baseStyle.colors.silver}}>
                    <Button style={{marginTop: 20}}>
                        <Text>Create game</Text>
                    </Button>
                </View>

                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text>Server ID:</Text>
                    <TextInput underlineColorAndroid="transparent"
                               style={[styles.input]}
                               placeholder="Server ID ..."
                               value={this.state.code}
                               onChangeText={(code) => this.setState({code: code.trim()})}/>

                    <Button>
                        <Text>Join</Text>
                    </Button>
                </View>
            </View>
        </View>
    }
}

export const route = {
    id: 'friendlyMatchSetup',
    component: FriendlyMatchSetup
};

const styles = StyleSheet.create({
    title: {
        marginHorizontal: 10,
        marginBottom: 10,
        paddingVertical: 20,
        fontSize: 20,
        textAlign: 'center'
    },
    main: {
        flex: 1,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputGoup: {
        paddingHorizontal: 10,
        alignSelf: 'stretch'
    },
    input: {
        fontSize: 18,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
        paddingBottom: 5,
    },
    buttonsWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'green',
        padding: 15,
        borderRadius: 30,
        minWidth: 200,
        alignItems: 'center',
        marginBottom: 50,
    },
    buttonText: {
        fontSize: 20
    },
});