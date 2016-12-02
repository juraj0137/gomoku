import React            from 'react';
import ReactNative      from 'react-native';
import {connect}        from "react-redux";
import {Button}         from '../../components/button';
import {baseStyle}      from '../../theme';
import {updateUserData} from '../../actions/user';

const {View}               = ReactNative;
const {Text}               = ReactNative;
const {TextInput}          = ReactNative;
const {StyleSheet}         = ReactNative;
const {InteractionManager} = ReactNative;

const Icon = require("react-native-vector-icons/FontAwesome").default;

class Settings extends React.Component<ISettingsProps, ISettingsState> {

    constructor(props: ISettingsProps) {
        super(props);

        this.state = {
            nick: this.props.user.nick,
            nickError: ''
        };
    }

    componentDidMount(): void {
        InteractionManager.runAfterInteractions(() => {
            this.setState({isLoading: false});
        });
    }

    private goBack = (): void => {
        this.props.navigator.pop();
    };

    private onSave = (): void => {
        if (this.state.nick == "") {
            this.setState({nickError: 'You must enter your nick'});
        } else {
            const {nick} = this.state;
            this.props.updateUserData({nick});
            this.goBack();
        }
    };

    public render() {

        if (this.state.isLoading)
            return null;

        let {nickError} = this.state;

        let errorInputStyle = nickError != '' ? {
            borderBottomWidth: 2,
            borderBottomColor: 'red',
        } : {};

        return (
            <View style={baseStyle.container}>
                <Text style={styles.title}> Settings</Text>
                <View style={styles.main}>

                    <View style={styles.inputGroup}>
                        <Text>Your nick:</Text>
                        <TextInput
                            underlineColorAndroid="transparent" style={[styles.input, errorInputStyle]}
                            placeholder="Type here your nick"
                            value={this.state.nick}
                            onChangeText={(nick: string) => this.setState({nick: nick.trim()})}
                        />
                        <Error error={nickError}/>
                    </View>

                    <View style={[styles.inputGroup, {flexDirection: 'row',justifyContent: 'space-around'}]}>
                        <Button onPress={this.goBack} style={{borderWidth: 0}}>
                            <Icon name="times" size={30}/>
                        </Button >

                        <Button onPress={this.onSave} style={{minWidth: 150}}>
                            <Text style={{fontSize: 20}}> Save </Text>
                        </Button>
                    </View>

                </View>
            </View>
        )
    }
}

const Error = (props: {error: string}) => {
    return props.error == '' ? null : <Text style={{color: 'red',fontSize: 12}}>{props.error}</Text>
};

const mapStateToProps = (state: IReduxState) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch: IDispatch<IReduxState>) => ({
    updateUserData: (user: IUser) => dispatch(updateUserData(user))
});

export const route: ISettingsRoute = {
    id: 'settings',
    component: connect(mapStateToProps, mapDispatchToProps)(Settings),
};

const styles = StyleSheet.create({
    title: {
        marginHorizontal: 10,
        marginBottom: 10,
        paddingVertical: 20,
        fontSize: 20,
        textAlign: 'center'
    } as TextStyle,
    main: {
        flex: 1,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    } as ViewStyle,
    inputGroup: {
        paddingHorizontal: 10,
        alignSelf: 'stretch'
    }as ViewStyle,
    input: {
        fontSize: 18,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
        paddingBottom: 5,
    } as TextStyle,
});
