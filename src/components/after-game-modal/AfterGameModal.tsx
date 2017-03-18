///<reference path="AfterGameModal.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';
import {AdMobInterstitial} from 'react-native-admob';

const {View}               = ReactNative;
const {Text}               = ReactNative;
const {Modal}              = ReactNative;
const {StyleSheet}         = ReactNative;
const {Dimensions}         = ReactNative;
const {BackAndroid}        = ReactNative;
const {TouchableHighlight} = ReactNative;

import {Button}    from '../button';
import {baseStyle} from '../../theme';
import {constants} from '../../config';

const Icon = require("react-native-vector-icons/FontAwesome").default;

class AfterGameModal extends React.Component<IAfterGameModalProps, IAfterGameModalState> {

    constructor(props: IAfterGameModalProps) {
        super(props);

        this.state = {
            modalHiddenForce: false
        }
    }

    public componentDidMount () {
        
        if(!__DEV__){
            AdMobInterstitial.requestAd();
        }
    }

    public render() {

        let text = '';
        let subText = '';
        let isActive = ["win", "loss", "tie", "opponent-left"].indexOf(this.props.type) !== -1;

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
            case "opponent-left":
                text = "Opponent left.";
                break;
        }

        const onBackToMenuPress = () => {
            this.props.onGoToMenuClick();
            this.setState({modalHiddenForce: true})
            
            if(!__DEV__){
                AdMobInterstitial.showAd();        
            }
        };

        const onNewGamePress = () => {
            if(!__DEV__){
                AdMobInterstitial.showAd(() => AdMobInterstitial.requestAd());        
            }
            this.props.onNewGameClick()
        };

        return (
            <Modal
                animationType={"fade"}
                transparent={false}
                onRequestClose={() => onBackToMenuPress()}
                visible={isActive && this.state.modalHiddenForce == false}
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
                        onPress={onNewGamePress}
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
