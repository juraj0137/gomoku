///<reference path="Button.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';

const {View}               = ReactNative;
const {TouchableHighlight} = ReactNative;

import {baseStyle} from '../../theme';

class Button extends React.Component<IButtonProps, any> {

    constructor(props: IButtonProps, context: any) {
        super(props, context);
    }

    public render() {

        let {style, children, border = 2} = this.props;

        let defaultStyle = {
            borderWidth: border,
            borderStyle: 'solid',
            borderColor: 'green',
            borderRadius: 45,
            minHeight: 56,
            minWidth: 56
        } as ViewStyle;

        let viewStyle = {
            flexDirection: 'row',
            justifyContent: 'center',
        } as ViewStyle;

        return (
            <TouchableHighlight
                style={[defaultStyle, style]}
                underlayColor="transparent"
                onPress={this.props.onPress}
            >
                <View style={[baseStyle.containerCenter, viewStyle]}>
                    {children}
                </View>
            </TouchableHighlight>
        )
    }
}

export {Button};