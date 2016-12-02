///<reference path="LoadingPage.d.tsx"/>
import React       from 'react';
import ReactNative from 'react-native';
import {baseStyle} from '../../theme';

const {View}              = ReactNative;
const {Text}              = ReactNative;
const {StyleSheet}        = ReactNative;
const {ActivityIndicator} = ReactNative;

const LoadingPage: StatelessComponent<ILoadingPageProps> = (props) => {

    return <View style={baseStyle.containerCenter}>
        <Text style={[baseStyle.bigText, styles.text]}>{props.text || ''}</Text>
        <ActivityIndicator animating={true} size="large"/>
    </View>
};

export {LoadingPage};

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        marginBottom: 50,
        fontSize: 20
    },
});
