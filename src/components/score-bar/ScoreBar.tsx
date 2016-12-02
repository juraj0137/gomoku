///<reference path="ScoreBar.d.tsx"/>
import React              from 'react';
import ReactNative        from 'react-native';
import {Player}           from './Player'
import {ChangeSignButton} from './ChangeSignButton'

const {View}       = ReactNative;
const {StyleSheet} = ReactNative;

const ScoreBar: StatelessComponent<IScoreBarProps> = (props) => {

    if (props.me == null || props.opponent == null)
        return null;

    const getSign = (player: IPlayer): string => {
        return props.playerToSignMapping.circle == player ? 'circle' : 'cross';
    };

    return (
        <View style={styles.scoreBoard}>
            <Player
                inTurn={props.me === props.playerInTurn}
                player={props.me}
                sign={getSign(props.me)}
            />
            <ChangeSignButton onPress={props.onSingChangeClick}/>
            <Player
                inTurn={props.opponent === props.playerInTurn}
                player={props.opponent}
                sign={getSign(props.opponent)}
            />
        </View>
    )
};

export {ScoreBar};

const styles = StyleSheet.create({
    scoreBoard: {
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
});
