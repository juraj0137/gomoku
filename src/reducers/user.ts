///<reference path="user.d.ts"/>
import {UPDATE_USER} from '../actions/user'

/**
 * Initial state
 *
 * @type {IReduxStateUser}
 */
const initialState: IReduxStateUser = {
    nick: '',
};

/**
 * Reducer for user data
 *
 * @param state
 * @param action
 * @returns {IReduxStateUser}
 */
function userReducer(state: IReduxStateUser = initialState, action: IAction) {

    if (action.type == UPDATE_USER) {
        const genericAction = action as IGenericAction<UPDATE_USER>;
        return Object.assign({}, state, genericAction.payload.user);
    }

    return state;
}

export default userReducer;
