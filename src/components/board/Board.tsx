///<reference path="Board.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';
import {Tile} from '../tile'
import {constants} from '../../config'
import {PanRespondEnhancer} from '../pan-respond-enhancer';

const {View} = ReactNative;
const {StyleSheet} = ReactNative;


const Board: StatelessComponent<IBoardProps> = (props) => {

    let width = constants.DEFAULT_COLUMNS * constants.TILE_WIDTH;
    let height = constants.DEFAULT_ROWS * constants.TILE_HEIGHT;

    let _onTouch = (x: number, y: number) => {

        let row = Math.floor(y / constants.TILE_HEIGHT);
        let column = Math.floor(x / constants.TILE_WIDTH);

        props.onTouch(row, column);
    };

    let applyPlayerMappingToMatrix = (): TileSign[][] => {
        let board: TileSign[][] = [];

        for (let numRow = 0; numRow < constants.DEFAULT_ROWS; numRow++) {
            let row: TileSign[] = [];
            for (let numCol = 0; numCol < constants.DEFAULT_COLUMNS; numCol++) {
                if (props.mappedMoves[numRow] && props.mappedMoves[numRow][numCol])
                    row.push(props.mappedMoves[numRow][numCol]);
                else
                    row.push(0);
            }
            board.push(row);
        }

        return board;
    };

    let _renderBoard = () => applyPlayerMappingToMatrix().map((row, i) => {
        return <View key={`row-${i}`} style={styles.row}>
            {row.map((cell, i) => <Tile sign={cell} key={`cell-${i}`}/>)}
        </View>
    });

    return (
        <PanRespondEnhancer
            width={width}
            height={height}
            onTouch={_onTouch}
            lastMove={props.lastMove}
        >
            {_renderBoard()}
        </PanRespondEnhancer>
    )
};

export {Board};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        flex: 1,
    } as ViewStyle,
});
