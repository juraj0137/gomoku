///<reference path="LoadingPage.d.tsx"/>
import React       from 'react';
import ReactNative from 'react-native';
import {baseStyle} from '../../theme';

const {View}              = ReactNative;
const {Text}              = ReactNative;
const {StyleSheet}        = ReactNative;
const {ActivityIndicator} = ReactNative;

const LoadingPage: StatelessComponent<ILoadingPageProps> = (props) => {

    const serverCode = props.serverCode && props.serverCode != null ?
        <View style={{marginBottom: 20, marginTop: -20}}>
            <Text style={[baseStyle.bigText]}>Server code</Text>
            <Code>{props.serverCode}</Code>
        </View> :
        null;

    return <View style={baseStyle.containerCenter}>
        {serverCode}
        <Text style={[baseStyle.bigText, styles.text]}>{props.text || ''}</Text>
        <ActivityIndicator animating={true} size="large"/>
    </View>
};

const Code: StatelessComponent<any> = (props) => {
    return <Text style={{fontWeight: 'bold', fontSize: 34, textAlign: 'center', letterSpacing: 2}}>
        {props.children}
    </Text>;
};

export {LoadingPage};

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        marginBottom: 50,
        fontSize: 20
    },
});
