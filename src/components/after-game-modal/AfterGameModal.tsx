///<reference path="AfterGameModal.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';

const {View}               = ReactNative;
const {Text}               = ReactNative;
const {Modal}              = ReactNative;
const {StyleSheet}         = ReactNative;
const {BackAndroid}        = ReactNative;
const {TouchableHighlight} = ReactNative;

import {Button}    from '../button';
import {baseStyle} from '../../theme';
import {constants} from '../../config';

const Icon = require("react-native-vector-icons/FontAwesome").default;

class AfterGameModal extends React.Component<IAfterGameModalProps, IAfterGameModalState> {

    public render() {

        let text = '';
        let subText = '';
        let isActive = ["win", "loss", "tie"].indexOf(this.props.type) !== -1;

        switch (this.props.type) {
            case "win":
                text = 'You won';
                subText = 'Congratulation!';
                break;
            case "loss":
                text = 'You lost';
                subText = 'Next time it will be better!';
                break;
            case "tie":
                text = "It's a tie";
                break;
        }

        const onBackToMenuPress = () => {
            this.props.onGoToMenuClick();
            BackAndroid.removeEventListener("hardwareBackPress", onBackToMenuPress);
        };

        const onNewGamePress = () => {
            this.props.onNewGameClick()
        };

        BackAndroid.addEventListener("hardwareBackPress", onBackToMenuPress);

        return (
            <Modal
                animationType={"fade"}
                transparent={false}
                onRequestClose={() => null}
                visible={isActive}
                onOrientationChange={() => this.forceUpdate()}
                supportedOrientations={null}
            >
                <View style={[baseStyle.container]}>

                    <Button border={0} onPress={onBackToMenuPress}>
                        <Icon name="arrow-left" size={20}/>
                        <Text style={[baseStyle.text, styles.buttonBackText]}>Back to menu</Text>
                    </Button>

                    <TouchableHighlight
                        style={baseStyle.containerCenterVertical}
                        onPress={this.props.onNewGameClick}
                        underlayColor="transparent"
                    >
                        <View style={baseStyle.containerCenter}>
                            <Text style={styles.mainHeadline}>{text}</Text>
                            <Text style={[baseStyle.text, styles.subHeadline]}>{subText}</Text>
                            <Text style={[baseStyle.text, styles.silverText]}>Tap anywhere to new game</Text>
                        </View>
                    </TouchableHighlight>

                </View>
            </Modal>
        );
    }
}

export {AfterGameModal};

const styles = StyleSheet.create({
    buttonBackText: {
        marginLeft: 10,
    } as TextStyle,
    mainHeadline: {
        fontSize: 30,
        fontWeight: 'bold',
        backgroundColor: baseStyle.colors.bg
    } as TextStyle,
    subHeadline: {
        marginBottom: 20
    } as TextStyle,
    silverText: {
        color: baseStyle.colors.silver
    } as TextStyle,
});
