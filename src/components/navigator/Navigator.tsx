///<reference path="Navigator.d.tsx"/>

import React, {Component} from "react";
import ReactNative        from "react-native";
import {route as homeRoute} from "../../screens/home";

const {View}        = ReactNative;
const {Navigator}   = ReactNative;
const {StyleSheet}  = ReactNative;
const {BackAndroid} = ReactNative;

/**
 * Navigator handle navigation ;)
 *
 * @class
 */
class MyNavigator extends Component<INavigatorProps, INavigatorState> {

    /**
     *
     * @param route
     * @param navigator
     * @returns {any}
     */
    private renderScene = (route: Route, navigator: NavigatorStatic): ReactElement<any> => {

        const backPressListener = () => {
            if (route.id !== "home") {
                navigator.pop();
                return true;
            }
            BackAndroid.exitApp();
        };

        BackAndroid.addEventListener("hardwareBackPress", backPressListener);

        const MyComponent = route.component;

        return <View style={styles.scene}>
            <MyComponent {...{route, navigator}} />
        </View>;
    };

    /**
     *
     * @returns {any}
     */
    public render() {
        return <Navigator
            initialRoute={homeRoute}
            renderScene={this.renderScene}
            configureScene={(route, routeStack) => Navigator.SceneConfigs.FadeAndroid}
        />;
    }
}

const styles = StyleSheet.create({
    scene: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    } as ViewStyle
});

export {MyNavigator as Navigator};
