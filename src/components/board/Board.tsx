///<reference path="Board.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';
import { Tile } from '../tile'
import { constants } from '../../config'
import { PanRespondEnhancer } from '../pan-respond-enhancer';
import { WinnerSequence } from "../../reducers/game";
// import { WinnerSequence } from "../../reducers/game";

const { View } = ReactNative;
const { StyleSheet } = ReactNative;

export class Board extends React.Component<IBoardProps, any>{

    tiles: Tile[][] = [];

    constructor(props: IBoardProps) {
        super(props);

        this.tiles = [];
    }

    highlightSequence(sequence: WinnerSequence): Promise<any> {

        const tiles = sequence
            .filter(cors => this.tiles[cors.row] && this.tiles[cors.row][cors.column])
            .map(cors => this.tiles[cors.row][cors.column]);

        const clearPromises = tiles.map(tile => tile.clearHighlight());

        const highlightPromises = tiles.map((tile, index) => {
            const delay = index * 60;
            return tile.highlight(true, { delay: delay });
        })

        return Promise.all(clearPromises).then(() =>
            Promise.all(highlightPromises)
        );
    }

    render() {
        let width = constants.DEFAULT_COLUMNS * constants.TILE_WIDTH;
        let height = constants.DEFAULT_ROWS * constants.TILE_HEIGHT;

        let _onTouch = (x: number, y: number) => {

            let row = Math.floor(y / constants.TILE_HEIGHT);
            let column = Math.floor(x / constants.TILE_WIDTH);

            this.props.onTouch(row, column);
        };

        let applyPlayerMappingToMatrix = (): TileSign[][] => {
            let board: TileSign[][] = [];

            for (let numRow = 0; numRow < constants.DEFAULT_ROWS; numRow++) {
                let row: TileSign[] = [];
                for (let numCol = 0; numCol < constants.DEFAULT_COLUMNS; numCol++) {
                    if (this.props.mappedMoves[numRow] && this.props.mappedMoves[numRow][numCol])
                        row.push(this.props.mappedMoves[numRow][numCol]);
                    else
                        row.push(0);
                }
                board.push(row);
            }

            return board;
        };

        let _renderBoard = () => applyPlayerMappingToMatrix().map((row, r) => {
            this.tiles.push([]);
            return <View key={`row-${r}`} style={styles.row}>
                {row.map((cell, c) => <Tile sign={cell} key={`cell-${c}`} ref={tile => { this.tiles[r].push(tile) }} />)}
            </View>
        });

        return (
            <PanRespondEnhancer
                width={width}
                height={height}
                onTouch={_onTouch}
                lastMove={this.props.lastMove}
            >
                {_renderBoard()}
            </PanRespondEnhancer>
        )
    }

}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        flex: 1,
    } as ViewStyle,
});
