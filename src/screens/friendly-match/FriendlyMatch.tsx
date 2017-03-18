import React from 'react'
import ReactNative from 'react-native'
import {connect} from 'react-redux'
import {route as multiplayerRoute} from '../multiplayer'
import {Button} from '../../components/button'
import {baseStyle} from '../../theme'

const {View} = ReactNative;
const {Text} = ReactNative;
const {TextInput} = ReactNative;
const {TouchableOpacity} = ReactNative;
const {Keyboard}             = ReactNative;

class FriendlyMatch extends React.Component<IFriendlyMatchProps, IFriendlyMatchState> {

    private input: __React.TextInput;

    constructor(props: IFriendlyMatchProps, context: any) {
        super(props, context);

        this.state = {
            joinGameFocused: false
        }
    }

    private startServer = (serverId: string) => {
        Keyboard.dismiss();
        this.props.navigator.push(Object.assign({}, multiplayerRoute, {serverId, create: true}));
    };

    private connectToServer = (serverId: string) => {
        Keyboard.dismiss();
        this.props.navigator.push(Object.assign({}, multiplayerRoute, {serverId, create: false}));
    };

    render(): any {

        const clearInput = () => {
            this.input.clear();
            this.setState({joinGameFocused: true})
        };

        const connectButtonStyle = {
            justifyContent: 'center',
            borderLeftColor: 'red',
            backgroundColor: '#ddd',
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
        } as ViewStyle;

        const textInputStyle = {
            flex: 1,
            borderRightWidth: this.state.joinGameFocused ? 1 : 0,
            borderRightColor: '#999'
        } as ViewStyle;
        /*

         */
        return <View style={[baseStyle.container, {paddingHorizontal: 20}]}>
            <Text style={styles.title}> Friendly match</Text>
            <View style={{
                    flexDirection: 'row',
                    position: 'relative',
                    borderWidth: 2,
                    borderColor: 'green',
                    borderStyle: 'solid',
                    borderRadius: 4,
                    overflow: 'hidden',
                    marginBottom: 40,
                }}>

                <TextInput
                    underlineColorAndroid="transparent"
                    style={[baseStyle.text, styles.input, textInputStyle]}
                    placeholder={'Enter server code'}
                    defaultValue="Join the game"
                    onChange={(e) => this.setState({serverCode: e.nativeEvent.text.trim()})}
                    onFocus={clearInput}
                    onBlur={() => this.setState({joinGameFocused: false})}
                    onSubmitEditing={() => this.connectToServer(this.state.serverCode)}
                    ref={(ref: any) => {this.input = ref}}
                    keyboardType="numeric"
                    maxLength={this.state.joinGameFocused ? 4 : 100}
                />

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={connectButtonStyle}
                    onPress={() => this.startServer(this.state.serverCode)}
                >
                    {this.state.joinGameFocused ? <Text style={{paddingHorizontal: 15}}>Connect</Text> : null}
                </TouchableOpacity>

            </View>
            <Button onPress={() => this.startServer(generateId())} innerStyle={{alignItems: 'center'}}
                    style={{marginBottom: 40}}>
                <Text style={baseStyle.text}>Create server</Text>
            </Button>
            <Text style={{lineHeight: 25, color: '#666'}}>
                One of the player has to create server, which generates 4-digit number. The second player will connect to server with this code.
            </Text>
        </View>;
    }
}

export const route = {
    id: 'friendly-match',
    component: connect()(FriendlyMatch)
};

const styles = ReactNative.StyleSheet.create({
    title: {
        marginHorizontal: 10,
        marginBottom: 80,
        paddingVertical: 20,
        fontSize: 20,
        textAlign: 'center'
    } as TextStyle,
    section: {
        flex: 1,
        justifyContent: 'center',
        padding: 30
    } as ViewStyle,
    sectionWithBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
    } as ViewStyle,
    input: {
        // minHeight: 56,
        padding: 8,
        textAlign: 'center',
        color: '#666',
    } as TextStyle,
});

const generateId = () => Math.round((Math.random() * 8999) + 1000).toString();