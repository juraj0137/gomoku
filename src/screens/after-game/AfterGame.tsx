///<reference path="AfterGame.d.tsx"/>
import React            from 'react';
import ReactNative      from 'react-native';
import {connect}        from "react-redux";
import {baseStyle}      from '../../theme';
import {Button}         from '../../components/button';
import {AdMobInterstitial}          from 'react-native-admob';
import {route as homeRoute}         from '../home';
import {constants} from '../../config'

const Icon = require("react-native-vector-icons/FontAwesome").default;

const {View}               = ReactNative;
const {Text}               = ReactNative;
const {BackAndroid}        = ReactNative;
const {TouchableHighlight} = ReactNative;

class AfterGame extends React.Component<IAfterGameProps, IAfterGameState> {

    constructor(props: IAfterGameProps) {
        super(props);
    }

    public componentDidMount() {
        AdMobInterstitial.requestAd();
        BackAndroid.addEventListener("hardwareBackPress", this.onBackToMenuPress);
    }


    componentWillUnmount(): void {
        BackAndroid.removeEventListener("hardwareBackPress", this.onBackToMenuPress);
    }

    onBackToMenuPress = () => {
        this.props.navigator.resetTo(homeRoute);
        if (constants.enableAd()) {
            AdMobInterstitial.showAd();
        }
    };

    onNewGamePress = () => {

        this.props.navigator.pop();
        if (constants.enableAd()) {
            AdMobInterstitial.showAd(() => {
                if(this.props.route.onNewGame){
                    this.props.route.onNewGame();
                }
                AdMobInterstitial.requestAd()
            });
        }else{
            if(this.props.route.onNewGame){
                this.props.route.onNewGame();
            }
        }
    };

    render() {

        let text = '';
        let subText = '';

        switch (this.props.route['status']) {
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
            default:
                console.error(this.props.route);
        }

        return <View style={baseStyle.container}>
            <View style={[baseStyle.container]}>

                <Button border={0} onPress={this.onBackToMenuPress}>
                    <Icon name="arrow-left" size={20}/>
                    <Text style={[baseStyle.text, styles.buttonBackText]}>Back to menu</Text>
                </Button>

                <TouchableHighlight
                    style={baseStyle.containerCenterVertical}
                    onPress={this.onNewGamePress}
                    underlayColor="transparent"
                >
                    <View style={baseStyle.containerCenter}>
                        <Text style={styles.mainHeadline}>{text}</Text>
                        <Text style={[baseStyle.text, styles.subHeadline]}>{subText}</Text>
                        <Text style={[baseStyle.text, styles.silverText]}>Tap anywhere to new game</Text>
                    </View>
                </TouchableHighlight>

            </View>

        </View>;
    }
}

const styles = ReactNative.StyleSheet.create({
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

export const route = {
    id: 'afterGame',
    component: connect()(AfterGame)
};
