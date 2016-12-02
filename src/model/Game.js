import {transpose} from './utils';
import Player from './Player'
import {
    GAME_CANCELED,
    GAME_LIVE,
    GAME_TIE,
    GAME_WINNER,
    DEFAULT_COLUMNS,
    DEFAULT_ROWS
} from './constants';

export default class Game {

    /**
     * @param settings
     */
    constructor(settings) {

        this.settings = Object.assign({
            rows: DEFAULT_ROWS,
            columns: DEFAULT_COLUMNS,
            sameInRow: 5,
            playerInTurn: null,
            playerA: null,
            playerB: null
        }, settings);

        this._checkCorrectSettings();

        this.getGameSettings().playerA.setGame(this);
        this.getGameSettings().playerB.setGame(this);

        let {rows, columns, playerInTurn, playerA, playerB} = this.settings;

        if (playerInTurn == null)
            this.settings.playerInTurn = Math.random() < 0.5 ? playerA : playerB;

        this.board = this._generateEmptyBoard(rows, columns);
        this.winner = null;
        this.moves = [];
        this.status = GAME_LIVE;

        // function binding
        this._existCell = this._existCell.bind(this)
    }

    /**
     *
     * @param {Player} player
     * @param row
     * @param column
     */
    addMove(player, row, column) {

        if (!this._existCell(row, column))
            throw new Error('Out of range');

        if (!this._isEmptyCell(row, column))
            throw new Error(`Field is not empty, [${row}, ${column}]`);

        if (!(player instanceof Player))
            throw new Error('Player has to be instance of Player');

        if (!(this.settings.playerA == player || this.settings.playerB == player))
            throw new Error('Invalid player');

        if (!this._isPlayerOnTurn(player))
            throw new Error('Player is not on turn');

        if (this._isWin() || this._isTie())
            throw new Error('Game is over');

        this.moves.push({row, column, player});

        this.board[row][column] = player;
        this._changePlayerInTurn();

        if (this._isWin() && typeof this._onChangeGameStatus == 'function') {
            this.status = GAME_WINNER;
            this._onChangeGameStatus(this)
        }

        if (this._isTie() && typeof this._onChangeGameStatus == 'function') {
            this.status = GAME_TIE;
            this._onChangeGameStatus(this)
        }
    }


    /**
     * @returns {{
     *  rows: number,
     *  columns: number,
     *  sameInRow: number,
     *  playerInTurn: Player,
     *  playerA: Player,
     *  playerB: Player
     * }}
     */
    getGameSettings() {
        return this.settings;
    }

    /**
     *
     * @returns {Player}
     */
    getPlayerInTurn() {
        return this.getGameSettings().playerInTurn;
    }

    /**
     *
     * @param {Player} me
     * @returns {Player}
     */
    getOpponent(me) {
        let {playerA, playerB} = this.getGameSettings();
        return playerA.getId() == me.getId() ? playerB : playerA;
    }

    /**
     * @returns {Array<Array<Player>>}
     */
    getGameBoard() {
        return this.board;
    }

    /**
     *
     * @returns {Array<{row: number, column: number, player: Player}>}
     */
    getMoves() {
        return this.moves;
    }

    /**
     *
     * @returns {*}
     */
    getGameStatus() {
        return this.status;
    }

    /**
     *
     * @returns {Player}
     */
    getWinner() {
        return this.winner;
    }

    /**
     *
     * @param {function} func
     */
    onChangeGameStatus(func) {
        this._onChangeGameStatus = func;
    }

    /**
     *
     * @private
     */
    _checkCorrectSettings() {

        let {playerA, playerB, rows, columns} = this.settings;

        if (!(playerA instanceof Player) || !(playerB instanceof Player))
            throw Error('You cannot create board without players');

        if (rows <= 0 || columns <= 0)
            throw Error('You cannot create board with negative or 0 dimension');
    }

    /**
     *
     * @returns {boolean}
     * @private
     */
    _isTie() {
        for (let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board[row].length; column++) {
                if (this.board[row][column] == 0)
                    return false;
            }
        }
        return true;
    }

    /**
     *
     * @returns {boolean}
     * @private
     */
    _isWin() {

        let checkVerticalLine = (board) => {

            let sameInSequnce = 0;
            let player = null;

            for (let row = 0; row < board.length; row++) {
                sameInSequnce = 0;
                player = null;
                for (let column = 0; column < board[row].length; column++) {

                    let field = board[row][column];

                    if (field instanceof Player) {
                        if (field == player) {
                            sameInSequnce++;
                            if (sameInSequnce >= this.settings.sameInRow) {
                                this.winner = player;
                                return true;
                            }
                        } else {
                            sameInSequnce = 1;
                            player = field;
                        }
                    } else {
                        // prerusena sekvencia, resetujeme countre
                        sameInSequnce = 0;
                        player = null;
                    }
                }
            }
        };

        let checkDiagonal = (board) => {

            let doCheck = (startRow, startColumn, reverse = false) => {

                let row = startRow;
                let column = startColumn;
                let sameInSequnce = 0;
                let player = null;
                let field = board[row][column];

                while (typeof field != 'undefined') {
                    if (field instanceof Player) {
                        if (field == player) {
                            sameInSequnce++;
                            if (sameInSequnce >= this.settings.sameInRow) {
                                this.winner = player;
                                return true;
                            }
                        } else {
                            sameInSequnce = 1;
                            player = field;
                        }
                    } else {
                        //prerusena sekvencia, resetujeme countre
                        sameInSequnce = 0;
                        player = null;
                    }

                    if (reverse)
                        row--;
                    else
                        row++;

                    column++;

                    if (typeof board[row] != 'undefined') {
                        field = board[row][column];
                    } else {
                        field = undefined;
                    }
                }
            };

            for (let startColumn = 0; startColumn < board[0].length; startColumn++) {
                if (doCheck(0, startColumn)) return true;
                if (doCheck(board.length - 1, startColumn, true)) return true;
            }

            for (let startRow = 0; startRow < board.length; startRow++) {
                if (doCheck(startRow, 1)) return true;
                if (doCheck(startRow, 0, true)) return true;
            }
        };

        if (checkVerticalLine(this.board)) return true;
        if (checkVerticalLine(transpose(this.board))) return true;
        if (checkDiagonal(this.board)) return true;

        return false;
    }

    /**
     *
     * @private
     */
    _changePlayerInTurn() {
        let {playerInTurn, playerA, playerB} = this.getGameSettings();
        this.settings.playerInTurn = playerInTurn == playerA ? playerB : playerA;
    }

    /**
     *
     * @param {Player} player
     * @returns {boolean}
     * @private
     */
    _isPlayerOnTurn(player) {
        return this.getGameSettings().playerInTurn.getId() == player.getId();
    }

    /**
     *
     * @param rows
     * @param columns
     * @returns {Array<Array>}
     * @private
     */
    _generateEmptyBoard(rows, columns) {
        var board = [];

        for (var numRow = 0; numRow < rows; numRow++) {

            board[numRow] = [];
            for (var numCol = 0; numCol < columns; numCol++) {
                board[numRow][numCol] = 0;
            }
        }

        return board;
    }

    /**
     *
     * @param row
     * @param column
     * @returns {boolean}
     * @private
     */
    _existCell(row, column) {
        return typeof this.board[row] !== 'undefined'
            && typeof this.board[row][column] !== 'undefined';
    }

    /**
     *
     * @param row
     * @param column
     * @returns {boolean}
     * @private
     */
    _isEmptyCell(row, column) {
        return this._existCell(row, column)
            && this.board[row][column] === 0;
    }
}
