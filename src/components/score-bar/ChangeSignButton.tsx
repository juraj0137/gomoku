import React       from 'react';
import ReactNative from 'react-native';

const {View} = ReactNative;
const {Text} = ReactNative;
const {StyleSheet} = ReactNative;
const {TouchableHighlight} = ReactNative;

const Icon = require("react-native-vector-icons/FontAwesome").default;

interface IChangeSignButtonProps {
    onPress: () => void;
}

const ChangeSignButton: StatelessComponent<IChangeSignButtonProps> = (props) => {

    return (
        <TouchableHighlight
            style={styles.changeSignButtonWrapper}
            underlayColor="transparent"
            onPress={props.onPress}
        >
            <View style={styles.changeSignButton}>
                <Icon name="refresh" size={20}/>
                <Text style={styles.changeText}>Change sign</Text>
            </View>
        </TouchableHighlight>
    )

};

export {ChangeSignButton};

const styles = StyleSheet.create({
    changeSignButtonWrapper: {
        marginBottom: -5,
    } as ViewStyle,
    changeSignButton: {
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
    } as ViewStyle,
    changeText: {
        fontSize: 12
    } as TextStyle,
});
