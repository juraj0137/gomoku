import * as constants from '../config/constants'
import * as fromGame from '../reducers/game';
import {Firebase} from '../model/Firebase'
import PromiseAction = Redux.PromiseAction;

export const INIT_GAME = 'INIT_GAME';
export type INIT_GAME = {
    me: IPlayer,
    opponent: IPlayer,
    playerInTurn: IPlayer,
    gameId: string,
};
type INIT_FUNCTION = IActionCreator<IGenericAction<INIT_GAME>>;

/**
 * Function to init new game
 *
 * @param me
 * @param opponent
 * @param playerInTurn
 * @param gameId
 * @return {IGenericAction<INIT_GAME>}
 */
export const initGame: INIT_FUNCTION = (me: IPlayer, opponent: IPlayer, playerInTurn: IPlayer = null, gameId: string = '') => ({
    type: INIT_GAME,
    payload: {
        me, opponent, playerInTurn, gameId
    }
});


export const MAKE_MOVE = 'MAKE_MOVE';
export const MAKE_MOVE_IT_ISNT_YOUR_TURN = 'it-isnt-your-turn';
export const MAKE_MOVE_FIELD_ISNT_EMPTY = 'field-isnt-empty';
export const MAKE_MOVE_GAME_END = 'game-end';
export const MAKE_MOVE_NORMAL = 'everything-is-ok';
export type MAKE_MOVE = {move: IMove};

/**
 * Function to make move. Function checks if you can make this move.
 * Dispatch function returns Promise object
 *
 * @param row
 * @param column
 * @param player
 * @return {IGenericAction<MAKE_MOVE>}
 */
export const makeMove: IActionCreator<any> = (row: number, column: number, player: IPlayer) => {

    return Promise.resolve((dispatch: any, getState: () => IReduxState) => {

        const state = getState();

        if (state.game.status != constants.GAME_LIVE) {
            return;
        }

        // check if player is in turn
        if (fromGame.getIsPlayersTurn(state.game, player) == false) {
            return Promise.reject(MAKE_MOVE_IT_ISNT_YOUR_TURN);
        }

        // check if field is empty
        if (fromGame.getIsEmptyField(state.game, row, column) == false) {
            return Promise.reject(MAKE_MOVE_FIELD_ISNT_EMPTY);
        }

        // add move
        return dispatch(addMove(row, column, player))
            .then(() => {

                const lastMove: IMove = {player, row, column};
                Firebase.sendMove(lastMove);

                // check if is tie + dispatch
                if (fromGame.getIsTie(getState().game)) {
                    dispatch(changeGameStatus(constants.GAME_TIE));
                    Firebase.endGame();
                    return Promise.resolve(MAKE_MOVE_GAME_END);
                } else if (fromGame.getIsWinner(getState().game, lastMove)) {
                    dispatch(changeGameStatus(constants.GAME_WINNER, player));
                    Firebase.endGame();
                    return Promise.resolve(MAKE_MOVE_GAME_END);
                } else {
                    return Promise.resolve(MAKE_MOVE_NORMAL);
                }

            });
    });
};


export const CHANGE_GAME_STATUS = 'CHANGE_GAME_STATUS';
export type CHANGE_GAME_STATUS = {status: string, winner?: IPlayer}

/**
 * Change game status (live, tie, winner)
 *
 * @param status
 * @param winner
 */
export const changeGameStatus: IActionCreator<IGenericAction<CHANGE_GAME_STATUS>> = (status: string, winner: IPlayer = null) => ({
    type: CHANGE_GAME_STATUS,
    payload: {
        status, winner
    }
});


export const ADD_MOVE = 'ADD_MOVE';
export type ADD_MOVE = {move: IMove};
type ADD_MOVE_FUNCTION = IActionCreator<IGenericAction<ADD_MOVE>>;

/**
 * Function add new move, no checking is executed
 *
 * @param row
 * @param column
 * @param player
 * @return {IGenericAction<ADD_MOVE>}
 */
export const addMove: IActionCreator<any> = (row: number, column: number, player: IPlayer) => {
    return (dispatch: any) => {
        dispatch({
            type: ADD_MOVE,
            payload: {
                move: {
                    player, row, column
                }
            }
        });
        return Promise.resolve();
    }
};


export const CHANGE_SIGNS = 'CHANGE_SIGNS';

/**
 * Function to change player's signs
 *
 * @return IAction
 */
export const changeSigns: IActionCreator<IAction> = () => ({
    type: CHANGE_SIGNS,
});


export const RESET = "RESET";
export const resetGame: IActionCreator<IAction> = () => ({
    type: RESET
});



