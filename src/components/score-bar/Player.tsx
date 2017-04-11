import React from 'react';
import ReactNative from 'react-native';
import { TILE_COLOR_RED, TILE_COLOR_BLUE } from "../../config/constants";

const { View } = ReactNative;
const { Text } = ReactNative;
const { StyleSheet } = ReactNative;

const Icon = require("react-native-vector-icons/FontAwesome").default;

interface IPlayerProps {
    inTurn: boolean;
    sign: string;
    player: IPlayer;
    reverse?: boolean;
}

const Player: StatelessComponent<IPlayerProps> = (props) => {

    let items: ReactElement<any>[] = [];
    let playerStyle = [styles.player, props.inTurn ? styles.playerInTurn : {}];
    let playerNameStyle = [styles.playerName, props.inTurn ? styles.playerNameInTurn : {}];
    let playerIconStyle = [
        styles.playerSign,
        { color: props.sign == 'cross' ? TILE_COLOR_BLUE : TILE_COLOR_RED }
    ];

    items.push(<Text key={1} style={playerNameStyle}>{props.player.nick}</Text>);
    items.push(<Icon key={2} name={props.sign == 'cross' ? 'times' : 'circle-o'} size={28} style={playerIconStyle} />);

    return <View style={playerStyle}>
        {props.reverse === true ? items.reverse() : items}
    </View>
};

export { Player };

const styles = StyleSheet.create({
    player: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
    } as ViewStyle,
    playerInTurn: {
        borderBottomWidth: 2,
        borderBottomColor: 'green',
    } as ViewStyle,
    playerName: {
        flex: 1,
        height: 22,
        fontSize: 16,
        overflow: 'hidden',
        textAlign: 'center',
    } as TextStyle,
    playerNameInTurn: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    } as TextStyle,
    playerSign: {
        padding: 5,
        paddingLeft: 6,
        paddingRight: 6,
    } as TextStyle
});