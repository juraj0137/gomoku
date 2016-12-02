import Player from './Player'
import {
    evaluatedGameBoard,
    FIELD_MINE,
    FIELD_OPPONENT,
    FIELD_EMPTY
} from './EvaluationAlg'


export default class PlayerBot extends Player {

    /**
     *
     */
    constructor() {
        super();

        this.id = 0;
        this.evaluatedGameBoard = null;
    }

    /**
     *
     * @returns {Promise}
     */
    makeMove() {

        let [row, column] = [0, 0];

        if (this.game.getMoves().length == 0) {
            // prvy tah do stredu
            row = Math.round(this.game.getGameSettings().rows / 2);
            column = Math.round(this.game.getGameSettings().columns / 2);
        } else {
            // ohodnot maticu
            this._evaluateGameBoard();

            // zisti naj poziciu
            let field = PlayerBot._findMostValuableField(this.evaluatedGameBoard);
            row = field.row;
            column = field.column;
        }

        // zavolaj funkciu na urobenie tahu
        return super.makeMove(row, column);
    }

    /**
     *
     * @private
     */
    _evaluateGameBoard() {

        if (this.evaluatedGameBoard == null)
            this._initEvaluateGameBoard();

        let matrix = this.getGame().getGameBoard().map(row => {
            return row.map(cell => {
                if (cell == 0)
                    return FIELD_EMPTY;

                if (cell.getId() == this.getId())
                    return FIELD_MINE;

                return FIELD_OPPONENT
            })
        });

        this.evaluatedGameBoard = evaluatedGameBoard({
            matrix: matrix,
            sameInSequence: this.getGame().getGameSettings().sameInRow
        })
    }

    /**
     *
     * @private
     */
    _initEvaluateGameBoard() {
        this.evaluatedGameBoard = [];
        this.getGame().getGameBoard().forEach((row, rowNum) => {
            this.evaluatedGameBoard[rowNum] = [];
            row.forEach((column, columnNumber) => {
                this.evaluatedGameBoard[rowNum][columnNumber] = 0;
            })
        })
    }

    /**
     * @param {Array<Array>} evaluation
     * @returns {*}
     */
    static _findMostValuableField(evaluation) {
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
