///<reference path="net.d.ts"/>
import {INTERNET_STATUS, ACTION_TYPES, CHANGE_STATUS} from '../actions/net';

const initialState: IReduxStateNet = {
    status: INTERNET_STATUS.OFFLINE,
};

export default function netReducer(state: IReduxStateNet = initialState, commonAction: IAction) {

    if (commonAction.type == ACTION_TYPES.CHANGE_INTERNET_STATUS) {
        const action = commonAction as  IGenericAction<CHANGE_STATUS>;
        return Object.assign({}, state, {
            status: action.payload.status
        });
    }

    return state;
}
