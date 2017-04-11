///<reference path="Tile.d.tsx"/>
import React       from 'react';
import ReactNative from 'react-native';
import {constants} from '../../config';

const Icon = require("react-native-vector-icons/FontAwesome").default;

const {StyleSheet} = ReactNative;
const {Animated}   = ReactNative;

const {TILE_WIDTH} = constants;
const {TILE_HEIGHT} = constants;

class Tile extends React.Component<ITileProps, ITileState> {

    private _animatedColor: __React.Animated.Value;
    private _highlightColor: string = 'rgba(14, 175, 14, 0.5)';

    protected componentWillMount(): void {
        this._animatedColor = new Animated.Value(0);
    }

    protected shouldComponentUpdate(nextProps: ITileProps): boolean {

        const oldSign = this.props.sign;
        const newSign = nextProps.sign;

        if (oldSign == newSign)
            return false;

        if (oldSign == 0 && (newSign == constants.TILE_CIRCLE || newSign == constants.TILE_CROSS))
            this._highlight();

        if ((oldSign == constants.TILE_CIRCLE || oldSign == constants.TILE_CROSS) && newSign == 0)
            this._animatedColor.setValue(0);

        return true;
    }

    public highlight = (long: boolean = false): void => {
        this._highlight(long);
    };

    private _highlight(long: boolean = false): void {

        this._animatedColor.setValue(100);

        if (long) return;

        Animated.timing(this._animatedColor, {
            toValue: 0,
            duration: 1500,
            delay: 500
        }).start();
    }

    render() {

        const animatedStyle = {
            backgroundColor: this._animatedColor.interpolate({
                inputRange: [0, 100],
                outputRange: ['rgba(255,255,255, 0)', this._highlightColor]
            })
        };

        let cellText = (): __React.ReactElement<any> => {
            switch (this.props.sign) {
                case constants.TILE_CIRCLE:
                    return <Icon name="circle-o" style={{color: constants.TILE_COLOR_RED}} size={TILE_HEIGHT * 0.6}/>;
                case constants.TILE_CROSS:
                    return <Icon name="times" style={{color: constants.TILE_COLOR_BLUE}} size={TILE_HEIGHT * 0.6}/>;
                default:
                    return null;
            }
        };

        return <Animated.View style={[styles.cell, animatedStyle]}>
            {cellText()}
        </Animated.View>;
    }
}

export {Tile};

const styles = StyleSheet.create({
    cell: {
        borderStyle: 'solid',
        borderColor: constants.TILE_BORDER_COLOR,
        borderWidth: constants.TILE_BORDER_WIDTH / 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        flex: 1,
    } as __React.ViewStyle
});
