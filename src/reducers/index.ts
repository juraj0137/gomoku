///<reference path="index.d.ts"/>
import {combineReducers} from "redux";
import user from './user'
import net from './net';
import websocket from './websocket';
import game, * as fromGame from './game'
import playerToSignMapping from './playerToSignMapping'

/**
 * Function to log last action
 *
 * @param state
 * @param action
 * @returns {IAction}
 */
function lastAction(state: any = null, action: IAction): IAction {
    return action;
}

/**
 * Main reducer created from smaller reducers
 */
const reducer = combineReducers({
    net,
    user,
    game,
    websocket,
    lastAction,
    playerToSignMapping,
});

export {reducer}

/**
 * Returns mapped array of moves
 * <pre>{
     *   [row]: {
     *      [column]: "circle"|"cross"
     *   }
     * }</pre>
 *
 * @param state
 */
export function getMappedMoves(state: IReduxState) {
    return fromGame.getMappedMoves(state.game, state.playerToSignMapping);
}
