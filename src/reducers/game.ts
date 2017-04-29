///<reference path="game.d.ts"/>
import { constants } from '../config';
import { INIT_GAME, ADD_MOVE, CHANGE_GAME_STATUS, RESET } from '../actions/game';
import { evaluatedGameBoard } from "../model/Evaluate";
import { BehaviorSubject } from 'rxjs'
import setPrototypeOf = Reflect.setPrototypeOf;

/**
 * Initial state
 *
 * @type {IReduxStateGame}
 */
const initialState: IReduxStateGame = {
    id: '',
    me: null,
    opponent: null,
    playerInTurn: null,
    moves: [],
    status: constants.GAME_CANCELED,
    winner: null,
};

/**
 * Subject of winner sequnce. Winner sequence is sorted array of tiles coordinates 
 * which belongs to winner sequnce
 */
export type WinnerSequence = { column: number, row: number }[];
export const winnerSequenceSubject = new BehaviorSubject<WinnerSequence>([]);

/**
 * Game reducer
 *
 * @param state
 * @param commonAction
 * @returns {IReduxStateGame}
 */
function gameReducer(state: IReduxStateGame = initialState, commonAction: IAction) {

    if (commonAction.type == INIT_GAME) {
        const action = commonAction as IGenericAction<INIT_GAME>;
        const { me, playerInTurn, opponent, gameId } = action.payload;

        return Object.assign({}, state, {
            id: gameId,
            me,
            opponent,
            playerInTurn: playerInTurn !== null ? playerInTurn : (Math.random() > 0.5 ? me : opponent),
            moves: [],
            board: {},
            winner: null,
            status: constants.GAME_LIVE
        });
    }

    if (commonAction.type == CHANGE_GAME_STATUS) {
        const action = commonAction as IGenericAction<CHANGE_GAME_STATUS>;

        return Object.assign({}, state, {
            winner: action.payload.winner,
            status: action.payload.status
        });
    }

    if (commonAction.type == ADD_MOVE) {

        const action = commonAction as IGenericAction<ADD_MOVE>;

        return Object.assign({}, state, {
            moves: [...state.moves, action.payload.move],
            playerInTurn: state.me == state.playerInTurn ? state.opponent : state.me,
        });
    }

    if (commonAction.type == RESET) {
        return Object.assign({}, initialState);
    }

    return state;
}

export default gameReducer;

export type MAPPED_MOVES = { [key: number]: { [key: number]: TileSign } };

/**
 * Returns mapped array of moves
 * <pre>{
 *   [row]: {
 *      [column]: "circle"|"cross"
 *   }
 * }</pre>
 *
 * @param state
 * @param mapping
 * @returns {MAPPED_MOVES}
 */
export function getMappedMoves(state: IReduxStateGame, mapping: IPlayerToSignMapping): MAPPED_MOVES {

    const result: MAPPED_MOVES = {};

    state.moves.forEach(move => {
        result[move.row] = result[move.row] || {};
        result[move.row][move.column] = mapping.circle == move.player ? constants.TILE_CIRCLE : constants.TILE_CROSS;
    });
    return result;
}

/**
 * Returns boolean value depends on if player is in turn
 *
 * @param state
 * @param player
 * @returns {boolean}
 */
export function getIsPlayersTurn(state: IReduxStateGame, player: IPlayer): boolean {
    return player === state.playerInTurn;
}

/**
 * Returns boolean value depends on if passed field is empty
 *
 * @param state
 * @param row
 * @param column
 * @return {boolean}
 */
export function getIsEmptyField(state: IReduxStateGame, row: number, column: number): boolean {
    return state.moves.filter(item => item.row == row && item.column == column).length == 0;
}

/**
 * Returns boolean value depends on if game board is full
 * Notice: call this function after checking if is there winner
 *
 * @param state
 * @return {boolean}
 */
export function getIsTie(state: IReduxStateGame): boolean {
    return state.moves.length == constants.DEFAULT_ROWS * constants.DEFAULT_COLUMNS;
}

/**
 * Returns boolean value depends on if last move was winner
 *
 * @param state
 * @param lastMove
 * @return {boolean}
 */
export function getIsWinner(state: IReduxStateGame, lastMove: IMove): boolean {


    type MAPPED_FILTERED_MOVES = { [key: number]: { [key: number]: number } }

    const vectors: { [key: string]: [number, number] } = {
        'up': [-1, 0], 'down': [1, 0], 'left': [0, -1], 'right': [0, 1],
        'upleft': [-1, -1], 'upright': [-1, 1], 'downleft': [1, -1], 'downright': [1, 1]
    };

    const moves: MAPPED_FILTERED_MOVES = {};

    state.moves
        .filter(move => move.player === lastMove.player)
        .forEach(move => {
            moves[move.row] = moves[move.row] || {};
            moves[move.row][move.column] = 1;
        });


    function getNumOfSameSign(direction: string) {
        let v = vectors[direction];
        let cnt = 0;

        for (let i = 1; i < constants.SAME_IN_ROW; i++) {
            let row = lastMove.row + (i * v[0]);
            let col = lastMove.column + (i * v[1]);
            if (typeof moves[row] == "undefined" || typeof moves[row][col] == "undefined")
                break;
            cnt++;
        }
        return cnt;
    }

    function getWinnerSequence(direction: string) {
        let v = vectors[direction];
        let cnt = [];

        for (let i = 1; i < constants.SAME_IN_ROW; i++) {
            let row = lastMove.row + (i * v[0]);
            let column = lastMove.column + (i * v[1]);
            if (typeof moves[row] == "undefined" || typeof moves[row][column] == "undefined")
                break;
            cnt.push({ row, column });
        }
        return cnt;
    }

    const winnerVector = [
        ['up', 'down'],
        ['left', 'right'],
        ['upleft', 'downright'],
        ['upright', 'downleft'],
    ].filter(vectors => {
        return 1 + getNumOfSameSign(vectors[0]) + getNumOfSameSign(vectors[1]) >= constants.SAME_IN_ROW
    });

    if (winnerVector.length >= 1) {
        const sortedSequence: WinnerSequence = [{ row: lastMove.row, column: lastMove.column }]
            .concat(getWinnerSequence(winnerVector[0][0]))
            .concat(getWinnerSequence(winnerVector[0][1]))
            .sort((a, b) => {
                if (b.column != a.column) {
                    return b.column - a.column;
                }
                return b.row - a.row;
            })
        winnerSequenceSubject.next(sortedSequence);
        return true;
    }
    return false;
}
















