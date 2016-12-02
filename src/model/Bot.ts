import {constants} from '../config';
import * as Evaluate from './Evaluate';

type MATRIX = number[][];

export class Bot {

    private evaluatedGameBoard: MATRIX = this._initEvaluateGameBoard();
    private player: IPlayer;

    constructor(player: IPlayer) {
        this.player = player;
    }

    public getNextMove(moves: ReadonlyArray<IMove>) {

        let row = Math.round(constants.DEFAULT_ROWS / 2);
        let column = Math.round(constants.DEFAULT_COLUMNS / 2);

        if (moves.length > 0) {
            // evaluate matrix
            this._evaluateGameBoard(moves);

            let field = this._findMostValuableField(this.evaluatedGameBoard);
            row = field.row;
            column = field.column;
        }

        return {
            row, column,
            player: this.player
        } as IMove;
    }

    private _evaluateGameBoard(moves: ReadonlyArray<IMove>) {

        let board: null|IPlayer[][] = [];

        for (let numRow = 0; numRow < constants.DEFAULT_ROWS; numRow++) {
            let row: null[] = [];
            for (let numCol = 0; numCol < constants.DEFAULT_COLUMNS; numCol++) {
                row.push(null);
            }
            board.push(row);
        }

        moves.forEach(move => {
            board[move.row] = board[move.row] || [];
            board[move.row][move.column] = move.player;
        });

        let matrix = board.map(row => {
            return row.map(player => {
                return player == null ? Evaluate.FIELD_EMPTY : (player == this.player ? Evaluate.FIELD_MINE : Evaluate.FIELD_OPPONENT);
            })
        });

        this.evaluatedGameBoard = Evaluate.evaluatedGameBoard(matrix);
    }

    private _initEvaluateGameBoard() {
        let board: MATRIX = [];
        for (let numRow = 0; numRow < constants.DEFAULT_ROWS; numRow++) {
            let row: number[] = [];
            for (let numCol = 0; numCol < constants.DEFAULT_COLUMNS; numCol++) {
                row.push(0);
            }
            board.push(row);
        }
        return board;
    }

    private _findMostValuableField(evaluation: MATRIX) {
        let result = {row: 0, column: 0, max: 0};

        evaluation.forEach((row, rowNum) => {
            row.forEach((col, colNum) => {
                if (col >= result.max) {
                    result = {max: col, row: rowNum, column: colNum};
                }
            })
        });

        return result;
    }
}
