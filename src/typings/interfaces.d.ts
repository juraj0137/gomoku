interface IUser {
    nick: string;
}

interface IRoute {
    id: string;
    component: __React.ComponentClass<__React.ViewProperties>;
}

interface IScreenProps {
    route: {[key: string]: any} | Route;
    navigator: __React.Navigator;
    dispatch: (action: any) => any;
}

declare namespace __React {

    interface NativeEventEmitter {
        dismiss(): void;
    }

    module Animated {

        interface MyAnimatedValue extends __React.Animated.AnimatedValue {
            __getValue: () => number;
        }

        class MyValueXY extends __React.Animated.ValueXY {
            x: MyAnimatedValue;
            y: MyAnimatedValue;
        }

        class MyValue extends __React.Animated.Value {
            __getValue: () => number;
        }
    }
}

declare module 'react-native-android-snackbar' {

    type SHORT = number;
    type LONG = number;
    type INDEFINITE = number;
    type UNTIL_CLICK = number;

    interface Options {
        duration?: SHORT | LONG | INDEFINITE | UNTIL_CLICK;
        actionColor?: string;
        actionLabel?: string;
        actionCallback?: () => void;
    }

    class SnackBar {
        public static dismiss(): void

        public static show(message: string, options?: Options): void

        public static LONG: LONG;
        public static SHORT: SHORT;
        public static INDEFINITE: INDEFINITE;
        public static UNTIL_CLICK: UNTIL_CLICK;
    }

    export = SnackBar;
}

declare module 'react-native-admob' {

    export class AdMobInterstitial {
        static requestAd: (any?: any) => any;
        static showAd: (any?: any) => any;
        static setAdUnitID: (any?: any) => any;

    }
}