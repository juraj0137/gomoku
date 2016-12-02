///<reference path="playerToSignMapping.d.ts"/>
import * as fromGame from '../actions/game'

/**
 * Initial state
 *
 * @type {IReduxStatePlayerToSign}
 */
const initialState: IReduxStatePlayerToSign = {
    circle: null,
    cross: null,
};

/**
 * Reducer for mapping player <-> sign
 *
 * @param state
 * @param commonAction
 * @returns {IReduxStatePlayerToSign}
 */
function playerToSignReducer(state: IReduxStatePlayerToSign = initialState, commonAction: IAction) {

    if (commonAction.type == fromGame.INIT_GAME) {
        const action = commonAction as IGenericAction<fromGame.INIT_GAME>;
        return {
            circle: action.payload.me,
            cross: action.payload.opponent,
        }
    }

    if (commonAction.type == fromGame.CHANGE_SIGNS) {
        return {
            circle: state.cross,
            cross: state.circle,
        };
    }

    return state;
}

export default playerToSignReducer;
