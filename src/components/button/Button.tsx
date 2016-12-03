///<reference path="Button.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';

const {View}               = ReactNative;
const {TouchableOpacity}   = ReactNative;
const {TouchableHighlight} = ReactNative;

import {baseStyle} from '../../theme';

class Button extends React.Component<IButtonProps, any> {

    constructor(props: IButtonProps, context: any) {
        super(props, context);
    }

    public render() {

        let {style, innerStyle, children, border = 2} = this.props;

        let defaultStyle = {
            borderWidth: border,
            borderStyle: 'solid',
            borderColor: 'green',
            minHeight: 56,
            minWidth: 56,
            borderRadius: 4,
        } as ViewStyle;

        let viewStyle = {
            flexDirection: 'row',
            justifyContent: 'center',
        } as ViewStyle;

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[defaultStyle, style]}
                onPress={this.props.onPress}
            >
                <View style={[baseStyle.containerCenterHorizontal, viewStyle, innerStyle]}>
                    {children}
                </View>
            </TouchableOpacity>
        )
    }
}

export {Button};